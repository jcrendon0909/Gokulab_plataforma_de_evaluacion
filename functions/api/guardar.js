// functions/api/guardar.js
import { MongoClient } from 'mongodb';

export async function onRequest(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Manejar peticiones preflight (OPTIONS)
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // Solo permitir POST
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers });
  }

  try {
    // 1. Leer los datos de la solicitud
    const data = await context.request.json();
    console.log('📦 Datos recibidos:', data); // <-- LOG 1

    const { nombre, email, edad, tipoTest, resultados, inteligenciaDominante } = data;

    // 2. Validar datos requeridos
    if (!nombre || !resultados) {
      console.log('❌ Validación fallida: faltan datos');
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), { status: 400, headers });
    }

    // 3. Verificar que la variable de entorno existe
    const uri = context.env.MONGODB_URI;
    if (!uri) {
      console.log('❌ Error: Variable de entorno MONGODB_URI no encontrada');
      return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta' }), { status: 500, headers });
    }
    console.log('🔑 URI de MongoDB:', uri ? '✅ existe' : '❌ no existe'); // <-- LOG 2

    // 4. Conectar a MongoDB
    console.log('🔄 Intentando conectar a MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db('gokulab_test');
    const collection = db.collection('resultados');

    // 5. Preparar el documento
    const nuevoResultado = {
      nombre: nombre.trim(),
      email: email || '',
      edad: parseInt(edad) || null,
      tipoTest: tipoTest || 'inteligencias',
      resultados: resultados,
      inteligenciaDominante: inteligenciaDominante || null,
      fecha: new Date().toISOString()
    };
    console.log('📝 Documento a guardar:', nuevoResultado); // <-- LOG 3

    // 6. Insertar en la base de datos
    const result = await collection.insertOne(nuevoResultado);
    console.log('✅ Documento insertado con ID:', result.insertedId);

    await client.close();

    // 7. Respuesta exitosa
    return new Response(JSON.stringify({
      success: true,
      id: result.insertedId,
      message: 'Resultado guardado exitosamente'
    }), { headers });

  } catch (error) {
    // 8. Capturar y mostrar el error real
    console.error('❌ ERROR en guardar:', error); // <-- LOG DE ERROR
    console.error('Stack trace:', error.stack);

    return new Response(JSON.stringify({
      error: error.message,        // <-- Esto muestra el error real
      stack: error.stack           // <-- Opcional, para depuración
    }), { status: 500, headers });
  }
}