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
    const client = new MongoClient(context.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('gokulab_test');
    const collection = db.collection('resultados');

    const [totalTests, tiposDistribucion] = await Promise.all([
      collection.countDocuments(),
      collection.aggregate([
        { $group: { _id: '$tipoTest', count: { $sum: 1 } } }
      ]).toArray()
    ]);

    await client.close();

    return new Response(JSON.stringify({
      totalTests,
      tiposDistribucion
    }), { headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500, headers });
  }
}