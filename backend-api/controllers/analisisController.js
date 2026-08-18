// backend-api/controllers/analisisController.js
const groqService = require('../services/groqService');
const Resultado = require('../models/Resultado');

exports.generarAnalisis = async (req, res) => {
    try {
        const { resultadoId } = req.params;

        const resultado = await Resultado.findById(resultadoId);
        if (!resultado) {
            return res.status(404).json({ error: 'Resultado no encontrado' });
        }

        let prompt = '';
        if (resultado.tipoTest === 'inteligencias') {
            prompt = construirPromptInteligencias(resultado);
        } else if (resultado.tipoTest === 'emprendedor') {
            prompt = construirPromptEmprendedor(resultado);
        } else {
            return res.status(400).json({ error: 'Tipo de test no soportado' });
        }

        // ✅ MODELO ACTUALIZADO
        const completion = await groqService.chatCompletion(
            [
                {
                    role: "system",
                    content: "Eres un coach educativo y de negocios especializado en desarrollo de talentos. Analizas resultados de tests y das recomendaciones prácticas, motivadoras y accionables. Hablas en español."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            "llama-3.1-70b-versatile",  // ← Cambio aquí
            { temperature: 0.7, max_tokens: 1024 }
        );

        const analisis = completion.choices[0]?.message?.content || '';

        resultado.analisis = analisis;
        await resultado.save();

        res.json({
            success: true,
            analisis
        });

    } catch (error) {
        console.error('❌ Error generando análisis:', error);
        res.status(500).json({
            error: error.message || 'Error al generar el análisis'
        });
    }
};

// ... resto del archivo (funciones de prompt) igual ...