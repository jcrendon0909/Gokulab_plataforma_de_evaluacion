const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const basicAuth = require('express-basic-auth');

dotenv.config();

const app = express();

// ========================
// 1. MIDDLEWARES GENERALES
// ========================
app.use(helmet());
app.use(cors({
  origin: ['https://test.gokulab.mx', 'https://gokulab-plataforma-de-evaluacion.pages.dev'],
  credentials: true
}));
app.use(express.json());

// ========================
// 2. CONEXIÓN A MONGODB
// ========================
mongoose.connect(process.env.MONGODB_URI, {
  family: 4,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// ========================
// 3. AUTENTICACIÓN BÁSICA (para rutas de admin)
// ========================
const adminAuth = basicAuth({
    users: { 'admin': 'gokulab2026' },
    challenge: true,
    unauthorizedResponse: 'Acceso no autorizado'
});

// Aplicar autenticación SOLO a las rutas de consulta y listado
app.use('/api/resultados/consultar', adminAuth);
app.use('/api/resultados/listar', adminAuth);

// ========================
// 4. RUTAS
// ========================
const resultadosRoutes = require('./routes/resultados');
const estadisticasRoutes = require('./routes/estadisticas');
const analisisController = require('./controllers/analisisController');

// Ruta de health check (pública)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rutas de la API
app.use('/api/resultados', resultadosRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.post('/api/analisis/:resultadoId', analisisController.generarAnalisis);

// ========================
// 5. MANEJO DE ERRORES (SIEMPRE AL FINAL)
// ========================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ========================
// 6. INICIAR SERVIDOR
// ========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});