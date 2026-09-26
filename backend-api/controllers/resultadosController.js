const Resultado = require('../models/Resultado');

exports.guardarResultado = async (req, res) => {
  try {
    const { nombre, email, edad, ocupacion, giroEspecifico, tipoTest, resultados, inteligenciaDominante } = req.body;

    if (!nombre || !resultados) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const nuevoResultado = new Resultado({
      nombre: nombre.trim(),
      email: email || '',
      edad: parseInt(edad) || null,
      ocupacion: ocupacion || null,
      giroEspecifico: giroEspecifico || null,
      tipoTest: tipoTest || 'inteligencias',
      resultados,
      inteligenciaDominante: inteligenciaDominante || null
    });

    const saved = await nuevoResultado.save();
    res.status(201).json({
      success: true,
      id: saved._id,
      message: 'Resultado guardado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error guardando resultado:', error);
    res.status(500).json({ error: 'Error al guardar el resultado' });
  }
};

exports.consultarResultados = async (req, res) => {
  try {
    const { nombre, tipo } = req.query;
    if (!nombre) {
      return res.status(400).json({ error: 'Se requiere el parámetro nombre' });
    }

    const query = { nombre: { $regex: nombre, $options: 'i' } };
    if (tipo) query.tipoTest = tipo;

    const resultados = await Resultado.find(query).sort({ fecha: -1 }).limit(50);
    res.json(resultados);
  } catch (error) {
    console.error('❌ Error consultando resultados:', error);
    res.status(500).json({ error: 'Error al consultar los resultados' });
  }
};

exports.listarResultados = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const tipo = req.query.tipo || '';

    const query = tipo ? { tipoTest: tipo } : {};

    const [data, total] = await Promise.all([
      Resultado.find(query).sort({ fecha: -1 }).skip(skip).limit(limit),
      Resultado.countDocuments(query)
    ]);

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error listando resultados:', error);
    res.status(500).json({ error: 'Error al listar los resultados' });
  }
};

exports.eliminarResultado = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Resultado.findByIdAndDelete(id);

    if (!resultado) {
      return res.status(404).json({ error: 'Resultado no encontrado' });
    }

    res.json({
      success: true,
      message: 'Registro eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando resultado:', error);
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
};
exports.actualizarResultado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, edad, ocupacion, giroEspecifico } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const datosActualizados = {
      nombre: nombre.trim(),
      email: email ? email.trim().toLowerCase() : '',
      edad: edad ? parseInt(edad) : null,
      ocupacion: ocupacion || null,
      giroEspecifico: giroEspecifico ? giroEspecifico.trim() : null
    };

    const resultado = await Resultado.findByIdAndUpdate(
      id,
      { $set: datosActualizados },
      { new: true, runValidators: true }
    );

    if (!resultado) {
      return res.status(404).json({ error: 'Resultado no encontrado' });
    }

    res.json({
      success: true,
      message: 'Registro actualizado exitosamente',
      data: resultado
    });
  } catch (error) {
    console.error('❌ Error actualizando resultado:', error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
};