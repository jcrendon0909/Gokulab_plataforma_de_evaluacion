const mongoose = require('mongoose');

const ResultadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  edad: {
    type: Number,
    min: 5,
    max: 99
  },
  tipoTest: {
    type: String,
    enum: ['inteligencias', 'emprendedor'],
    default: 'inteligencias'
  },
  resultados: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  inteligenciaDominante: {
    type: String,
    default: null
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

ResultadoSchema.index({ nombre: 1 });
ResultadoSchema.index({ fecha: -1 });
ResultadoSchema.index({ tipoTest: 1 });

module.exports = mongoose.model('Resultado', ResultadoSchema);
