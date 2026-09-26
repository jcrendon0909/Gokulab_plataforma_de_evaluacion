const express = require('express');
const router = express.Router();
const {
  guardarResultado,
  consultarResultados,
  listarResultados,
  eliminarResultado
} = require('../controllers/resultadosController');

router.post('/guardar', guardarResultado);
router.get('/consultar', consultarResultados);
router.get('/listar', listarResultados);
router.delete('/:id', eliminarResultado);

module.exports = router;