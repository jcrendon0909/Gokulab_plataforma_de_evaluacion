const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ['https://test.gokulab.mx', 'https://gokulab-plataforma-de-evaluacion.pages.dev'],
  credentials: true
}));
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  family: 4,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas
const resultadosRoutes = require('./routes/resultados');
const estadisticasRoutes = require('./routes/estadisticas');

app.use('/api/resultados', resultadosRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});