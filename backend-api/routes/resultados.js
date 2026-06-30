const express = require('express');
const router = express.Router();
const {
  guardarResultado,
  consultarResultados,
  listarResultados
} = require('../controllers/resultadosController');

router.post('/guardar', guardarResultado);
router.get('/consultar', consultarResultados);
router.get('/listar', listarResultados);

module.exports = router;