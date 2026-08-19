const groqService = require('../services/groqService');
const Resultado = require('../models/Resultado');

// ============================================
// CONTROLADOR PRINCIPAL
// ============================================
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
        } else if (resultado.tipoTest === 'liderazgo') {
            prompt = construirPromptLiderazgo(resultado);
        } else {
            return res.status(400).json({ error: 'Tipo de test no soportado' });
        }

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
            null,
            { temperature: 0.7, max_tokens: 1024 }
        );

        const analisis = completion.choices[0]?.message?.content || '';
        resultado.analisis = analisis;
        await resultado.save();

        res.json({ success: true, analisis });

    } catch (error) {
        console.error('❌ Error generando análisis:', error);
        res.status(500).json({ error: error.message || 'Error al generar el análisis' });
    }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function construirPromptInteligencias(resultado) {
    const puntajes = resultado.resultados;
    const dominante = resultado.inteligenciaDominante || 'No determinado';
    let detallePuntajes = Array.isArray(puntajes) 
        ? puntajes.map(p => `${p.tipo}: ${p.puntaje}/8 (${p.porcentaje.toFixed(0)}%)`).join('\n')
        : 'No hay datos detallados disponibles.';
    return `
    Resultados del Test de Inteligencias Múltiples para ${resultado.nombre}:
    ${detallePuntajes}
    Inteligencia dominante: ${dominante}
    Por favor, genera:
    1. Una descripción personalizada de las fortalezas de esta persona basada en sus resultados.
    2. 3 ejercicios o actividades prácticas para desarrollar su inteligencia dominante.
    3. 2 recomendaciones para mejorar las inteligencias con menor puntaje.
    4. Un mensaje motivacional final.
    `;
}

function construirPromptEmprendedor(resultado) {
    const detalle = resultado.resultados?.detalle || [];
    const total = resultado.resultados?.total || 0;
    let detalleAtributos = detalle.length > 0 
        ? detalle.map(a => `${a.icono || ''} ${a.nombre}: ${a.puntaje}/5`).join('\n')
        : 'No hay datos detallados disponibles.';
    return `
    Resultados del Test de Actitud Emprendedora para ${resultado.nombre}:
    Puntaje total: ${total}/50
    Detalle por atributo:
    ${detalleAtributos}
    Por favor, genera:
    1. Un perfil emprendedor personalizado basado en estos resultados.
    2. 3 áreas de oportunidad específicas con ejercicios para fortalecerlas.
    3. 2 fortalezas clave que debe potenciar.
    4. Un plan de acción de 3 pasos para su desarrollo emprendedor.
    `;
}

// ===== NUEVA FUNCIÓN PARA LIDERAZGO =====
function construirPromptLiderazgo(resultado) {
    const dimensiones = resultado.resultados?.dimensiones || {};
    const perfil = resultado.resultados?.perfil || 'No determinado';
    const puntajeTotal = resultado.resultados?.puntajeTotal || 0;

    let detalleDimensiones = Object.entries(dimensiones)
        .map(([key, value]) => {
            const nombres = {
                estrategica: 'Estratégica',
                transformacional: 'Transformacional',
                operativa: 'Operativa',
                social: 'Social',
                adaptativa: 'Adaptativa',
                etica: 'Ética',
                desarrollo: 'Desarrollo de Personas'
            };
            const nivel = value <= 15 ? 'Baja' : value <= 22 ? 'Media' : 'Alta';
            return `${nombres[key] || key}: ${value}/30 (${nivel})`;
        })
        .join('\n');

    return `
    Resultados del Test de Liderazgo Integral para ${resultado.nombre}:
    Puntaje total: ${puntajeTotal}/210
    Perfil de liderazgo: ${perfil}

    Detalle por dimensión:
    ${detalleDimensiones}

    Por favor, genera un análisis completo que incluya:
    1. Un perfil detallado de liderazgo basado en estos resultados.
    2. Las 3 fortalezas principales del líder y cómo potenciarlas.
    3. Las 3 áreas de oportunidad más relevantes y ejercicios prácticos para desarrollarlas.
    4. Un plan de acción de 30 días para consolidar su liderazgo.
    5. Un mensaje motivacional final.
    `;
}