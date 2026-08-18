const Resultado = require('../models/Resultado');

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const [totalTests, tiposDistribucion] = await Promise.all([
      Resultado.countDocuments(),
      Resultado.aggregate([
        { $group: { _id: '$tipoTest', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      totalTests,
      tiposDistribucion
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};