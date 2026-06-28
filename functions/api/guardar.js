import { MongoClient } from 'mongodb';

export async function onRequest(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const data = await context.request.json();
    const { nombre, email, edad, tipoTest, resultados, inteligenciaDominante } = data;

    if (!nombre || !resultados) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), { status: 400, headers });
    }

    const client = new MongoClient(context.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('gokulab_test');
    const collection = db.collection('resultados');

    const nuevoResultado = {
      nombre: nombre.trim(),
      email: email || '',
      edad: parseInt(edad) || null,
      tipoTest: tipoTest || 'inteligencias',
      resultados: resultados,
      inteligenciaDominante: inteligenciaDominante || null,
      fecha: new Date().toISOString()
    };

    const result = await collection.insertOne(nuevoResultado);
    await client.close();

    return new Response(JSON.stringify({
      success: true,
      id: result.insertedId,
      message: 'Resultado guardado exitosamente'
    }), { headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500, headers });
  }
}