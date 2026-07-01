// backend-api/controllers/analisisController.js
const groqService = require('../services/groqService');
const Resultado = require('../models/Resultado');

// Controlador principal
exports.generarAnalisis = async (req, res) => {
    try {
        const { resultadoId } = req.params;

        // Buscar el resultado en la base de datos
        const resultado = await Resultado.findById(resultadoId);
        if (!resultado) {
            return res.status(404).json({ error: 'Resultado no encontrado' });
        }

        // Construir el prompt según el tipo de test
        let prompt = '';
        if (resultado.tipoTest === 'inteligencias') {
            prompt = construirPromptInteligencias(resultado);
        } else if (resultado.tipoTest === 'emprendedor') {
            prompt = construirPromptEmprendedor(resultado);
        } else {
            return res.status(400).json({ error: 'Tipo de test no soportado' });
        }

        // Llamar al servicio de Groq con failover
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
            "llama3-70b-8192",
            { temperature: 0.7, max_tokens: 1024 }
        );

        const analisis = completion.choices[0]?.message?.content || '';

        // Guardar el análisis en el resultado
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

// --- Funciones auxiliares para construir prompts ---

function construirPromptInteligencias(resultado) {
    const puntajes = resultado.resultados;
    const dominante = resultado.inteligenciaDominante || 'No determinado';

    return `
    Resultados del Test de Inteligencias Múltiples para ${resultado.nombre}:
    ${puntajes.map(p => `${p.tipo}: ${p.puntaje}/8 (${p.porcentaje.toFixed(0)}%)`).join('\n')}

    Inteligencia dominante: ${dominante}

    Por favor, genera:
    1. Una descripción personalizada de las fortalezas de esta persona basada en sus resultados.
    2. 3 ejercicios o actividades prácticas para desarrollar su inteligencia dominante.
    3. 2 recomendaciones para mejorar las inteligencias con menor puntaje.
    4. Un mensaje motivacional final.
    `;
}

function construirPromptEmprendedor(resultado) {
    const detalle = resultado.resultados.detalle || [];
    const total = resultado.resultados.total || 0;

    return `
    Resultados del Test de Actitud Emprendedora para ${resultado.nombre}:
    Puntaje total: ${total}/50
    Detalle por atributo:
    ${detalle.map(a => `${a.nombre}: ${a.puntaje}/5`).join('\n')}

    Por favor, genera:
    1. Un perfil emprendedor personalizado basado en estos resultados.
    2. 3 áreas de oportunidad específicas con ejercicios para fortalecerlas.
    3. 2 fortalezas clave que debe potenciar.
    4. Un plan de acción de 3 pasos para su desarrollo emprendedor.
    `;
}