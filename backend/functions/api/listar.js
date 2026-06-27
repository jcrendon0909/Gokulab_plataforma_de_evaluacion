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
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    const client = new MongoClient(context.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('gokulab');
    const collection = db.collection('resultados');

    const [resultados, total] = await Promise.all([
      collection.find().sort({ fecha: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments()
    ]);

    await client.close();

    return new Response(JSON.stringify({
      data: resultados,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }), { headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500, headers });
  }
}