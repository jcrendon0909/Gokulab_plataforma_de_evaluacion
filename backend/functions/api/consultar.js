import { MongoClient } from 'mongodb';

export async function onRequest(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const url = new URL(context.request.url);
    const nombre = url.searchParams.get('nombre');
    const tipo = url.searchParams.get('tipo') || '';

    if (!nombre) {
      return new Response(JSON.stringify({ error: 'Se requiere el parámetro nombre' }), { status: 400, headers });
    }

    const client = new MongoClient(context.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('gokulab_test');
    const collection = db.collection('resultados');

    const query = { nombre: { $regex: nombre, $options: 'i' } };
    if (tipo) query.tipoTest = tipo;

    const resultados = await collection.find(query).sort({ fecha: -1 }).limit(50).toArray();
    await client.close();

    return new Response(JSON.stringify(resultados), { headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500, headers });
  }
}