const express = require('express');
const router = express.Router();
const {
  guardarResultado,
  consultarResultados,
  listarResultados,
  eliminarResultado,
  actualizarResultado
} = require('../controllers/resultadosController');

router.post('/guardar', guardarResultado);
router.get('/consultar', consultarResultados);
router.get('/listar', listarResultados);
router.put('/:id', actualizarResultado);
router.delete('/:id', eliminarResultado);

module.exports = router;