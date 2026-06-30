// functions/api/guardar.js
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

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers });
  }

  try {
    const data = await context.request.json();
    const { nombre, email, edad, tipoTest, resultados, inteligenciaDominante } = data;

    if (!nombre || !resultados) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), { status: 400, headers });
    }

    const uri = context.env.MONGODB_URI;
    if (!uri) {
      return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta' }), { status: 500, headers });
    }

    // 🔥 MEJORA: Configuración optimizada para Cloudflare Workers
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,  // 10 segundos para selección de servidor
      connectTimeoutMS: 10000,          // 10 segundos para conexión inicial
      socketTimeoutMS: 45000,           // 45 segundos para operaciones
      family: 4,                        // Forzar IPv4 (como en tu otra app)
      retryWrites: true,
      retryReads: true,
    });

    await client.connect();
    console.log('✅ Conectado a MongoDB');

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
    console.error('❌ ERROR en guardar:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), { status: 500, headers });
  }
}