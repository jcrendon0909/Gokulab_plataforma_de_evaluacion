const express = require('express');
const router = express.Router();
const { obtenerEstadisticas } = require('../controllers/estadisticasController');

router.get('/', obtenerEstadisticas);

module.exports = router;