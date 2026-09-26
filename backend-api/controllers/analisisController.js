const groqService = require('../services/groqService');
const Resultado = require('../models/Resultado');

// ============================================
// SYSTEM PROMPT - ROL Y REGLAS GLOBALES
// ============================================
const SYSTEM_PROMPT = `Eres un consultor senior en desarrollo humano, psicologia aplicada y liderazgo organizacional, con mas de 15 anos de experiencia interpretando evaluaciones psicometricas para profesionales, emprendedores y directivos. Tu trabajo es entregar diagnosticos profundos, personalizados y accionables, no consejos genericos.

CONTEXTO DE LA AUDIENCIA:
El lector es la persona evaluada. Quiere entender que revelan sus resultados y como usarlos para mejorar. No es un psicologo clinico; es alguien que busca claridad y accion.

PRINCIPIOS DE CALIDAD (OBLIGATORIO):
1. EVIDENCIA: Cada afirmacion debe estar respaldada por un puntaje especifico. En lugar de "eres muy analitico", escribe "Tu puntaje de 7 sobre 8 en la dimension LOGICA indica un pensamiento estructurado y sistematico".
2. INTERPRETACION CRUZADA: No analices cada dimension de forma aislada. Explica como se combinan o contradicen entre si.
3. APLICACION CONCRETA: Relaciona los hallazgos con situaciones reales: equipos de trabajo, liderazgo, emprendimiento, relaciones personales o toma de decisiones.
4. ACCIONES SMART: Cada ejercicio o recomendacion debe ser Especifico, Medible, Alcanzable, Relevante y con Tiempo definido.
5. HONESTIDAD CALIBRADA: Se motivador pero no exageres. Si un puntaje es bajo, no lo maquilles.
6. NO DIAGNOSTICO CLINICO: No uses terminos medicos, psiquiatricos ni diagnosticos. No prometas resultados garantizados.

REGLAS ESTRICTAS DE FORMATO (OBLIGATORIO CUMPLIR):
- Escribe en texto plano, en espanol neutro y profesional.
- NO uses emojis de ningun tipo.
- NO uses asteriscos, almohadillas, guiones bajos ni markdown.
- NO uses guiones al inicio de lineas. Para listas usa "1.", "2.", "3." seguido de un punto y un espacio.
- NO uses tablas ni bloques de codigo.
- Cada seccion inicia con un titulo en MAYUSCULAS terminado en dos puntos, seguido de un salto de linea.
- Deja una linea en blanco entre cada seccion.
- Usa parrafos cortos, claros y bien construidos.

ESTRUCTURA DE RAZONAMIENTO (INTERNO, NO LO MUESTRES):
Antes de escribir la respuesta final, analiza en silencio:
1. Cuales son los 2 o 3 puntajes mas altos y que combinacion revelan.
2. Cuales son los 2 o 3 puntajes mas bajos y que oportunidades representan.
3. Si existe alguna contradiccion o tension entre dimensiones.
4. Que tipo de perfil general emerge.
5. Cual seria el consejo mas util y menos obvio para esta persona especifica.

Solo despues de ese analisis interno, redacta la respuesta final.`;

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
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            null,
            { temperature: 0.7, max_tokens: 2000 }
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
// UTILIDAD: MAPA DE OCUPACIÓN
// ============================================
const mapaOcupacion = {
    estudiante: 'estudiante',
    empleado: 'empleado(a) o colaborador(a)',
    emprendedor: 'emprendedor(a) o duenio(a) de negocio',
    freelancer: 'freelancer o profesionista independiente',
    directivo: 'directivo(a) o gerente',
    docente: 'docente o instructor(a)',
    hogar: 'dedicado(a) a labores del hogar',
    buscando: 'persona en busqueda de oportunidad laboral',
    otro: 'con ocupacion diversa'
};

function construirContexto(resultado) {
    const ocupacionTexto = resultado.ocupacion 
        ? mapaOcupacion[resultado.ocupacion] || resultado.ocupacion 
        : null;
    const giroTexto = resultado.giroEspecifico || null;

    let contexto = '';
    if (ocupacionTexto || resultado.edad) {
        contexto = `\nCONTEXTO DEL EVALUADO:`;
        if (resultado.edad) contexto += `\nEdad: ${resultado.edad} anos.`;
        if (ocupacionTexto) contexto += `\nOcupacion: ${ocupacionTexto}.`;
        if (giroTexto) contexto += `\nGiro o area: ${giroTexto}.`;
    }
    return { contexto, ocupacionTexto, giroTexto };
}

// ============================================
// PROMPT 1: INTELIGENCIAS MULTIPLES
// ============================================
function construirPromptInteligencias(resultado) {
    const puntajes = resultado.resultados || [];
    const dominante = resultado.inteligenciaDominante || 'No determinado';

    const ordenados = [...puntajes].sort((a, b) => b.puntaje - a.puntaje);
    const top3 = ordenados.slice(0, 3);
    const bottom2 = ordenados.slice(-2);

    let detallePuntajes = puntajes.map(p =>
        `${p.tipo}: ${p.puntaje} de 8 (${p.porcentaje.toFixed(0)} por ciento)`
    ).join('\n');

    const { contexto, ocupacionTexto, giroTexto } = construirContexto(resultado);

    return `Perfil evaluado: Inteligencia Multiple de Howard Gardner.
Persona: ${resultado.nombre}.${contexto}

PUNTAJES COMPLETOS:
${detallePuntajes}

Inteligencia dominante: ${dominante}
Fortalezas principales detectadas: ${top3.map(t => t.tipo).join(', ')}
Areas con mayor margen de desarrollo: ${bottom2.map(b => b.tipo).join(', ')}

INSTRUCCION ESPECIAL DE CONTEXTO:
${ocupacionTexto ? `Adapta TODAS las interpretaciones, ejemplos y ejercicios al contexto de una persona que se desempenia como ${ocupacionTexto}${giroTexto ? ` en el area de ${giroTexto}` : ''}. Usa ejemplos concretos de ese entorno profesional.` : 'Adapta las interpretaciones y ejercicios a un contexto profesional general.'}
${resultado.edad ? `Considera tambien su etapa de vida (${resultado.edad} anos) para calibrar el tono y las recomendaciones.` : ''}

TAREA:
Redacta un diagnostico integral del perfil de esta persona, con las siguientes cinco secciones. Cada seccion inicia con su titulo en mayusculas terminado en dos puntos.

PERFIL GENERAL:
Un parrafo de 5 a 7 oraciones que sintetice como se combinan sus inteligencias. Explica que tipo de perfil emerge y menciona al menos dos puntajes especificos que respalden tu interpretacion. Relaciona el perfil con su desempenio en el contexto de ${ocupacionTexto || 'su entorno profesional'}${giroTexto ? ` (${giroTexto})` : ''}.

FORTALEZAS PRINCIPALES:
Tres fortalezas numeradas como 1., 2. y 3., basadas en los puntajes mas altos. Cada una debe incluir: el nombre de la inteligencia, el puntaje exacto entre parentesis, y una explicacion de como se manifiesta especificamente en su trabajo o vida diaria como ${ocupacionTexto || 'profesional'}.

AREAS DE OPORTUNIDAD:
Dos areas numeradas como 1. y 2., basadas en los puntajes mas bajos. Cada una debe incluir: el nombre de la inteligencia, el puntaje exacto entre parentesis, y una explicacion honesta de como esa carencia puede limitar su desarrollo en su contexto actual.

EJERCICIOS PRACTICOS:
Tres ejercicios numerados como 1., 2. y 3., dirigidos a fortalecer la inteligencia dominante. Cada ejercicio debe ser SMART y estar contextualizado a su ocupacion y giro.

MENSAJE FINAL:
Un parrafo de 3 a 4 oraciones dirigido directamente a la persona, con un tono motivador, realista y sin frases hechas, que reconozca su contexto particular.`;
}

// ============================================
// PROMPT 2: ACTITUD EMPRENDEDORA
// ============================================
function construirPromptEmprendedor(resultado) {
    const detalle = resultado.resultados?.detalle || [];
    const total = resultado.resultados?.total || 0;

    const ordenados = [...detalle].sort((a, b) => b.puntaje - a.puntaje);
    const top3 = ordenados.slice(0, 3);
    const bottom3 = ordenados.slice(-3);

    let detalleAtributos = detalle.map(a =>
        `${a.nombre}: ${a.puntaje} de 5`
    ).join('\n');

    const { contexto, ocupacionTexto, giroTexto } = construirContexto(resultado);

    return `Perfil evaluado: Actitud Emprendedora (10 atributos).
Persona: ${resultado.nombre}.${contexto}

PUNTAJE TOTAL: ${total} de 50.

DETALLE POR ATRIBUTO:
${detalleAtributos}

Fortalezas emprendedoras principales: ${top3.map(t => `${t.nombre} (${t.puntaje}/5)`).join(', ')}
Areas de oportunidad emprendedora: ${bottom3.map(b => `${b.nombre} (${b.puntaje}/5)`).join(', ')}

INSTRUCCION ESPECIAL DE CONTEXTO:
${ocupacionTexto === 'emprendedor(a) o duenio(a) de negocio' ? `Esta persona YA es emprendedora${giroTexto ? ` en el giro de ${giroTexto}` : ''}. Evita consejos basicos de como empezar un negocio y enfocate en COMO ESCALAR, profesionalizar y fortalecer su emprendimiento existente.` : ocupacionTexto ? `Adapta las interpretaciones y ejercicios al contexto de una persona que se desempenia como ${ocupacionTexto}${giroTexto ? ` en el area de ${giroTexto}` : ''}.` : 'Adapta las interpretaciones y ejercicios a un contexto profesional general.'}

TAREA:
Redacta un diagnostico integral del perfil emprendedor de esta persona, con las siguientes cinco secciones. Cada seccion inicia con su titulo en mayusculas terminado en dos puntos.

PERFIL EMPRENDEDOR:
Un parrafo de 5 a 7 oraciones que describa su estilo emprendedor. Menciona al menos tres atributos especificos con sus puntajes. Explica si su perfil se inclina mas hacia la ejecucion, la vision, la venta, la disciplina o la relacion con clientes. Relaciona el perfil con el tipo de negocio o proyecto donde tendria mayor probabilidad de exito${giroTexto ? ` dentro o relacionado con ${giroTexto}` : ''}.

FORTALEZAS CLAVE:
Tres fortalezas numeradas como 1., 2. y 3. Cada una debe incluir: el nombre del atributo, el puntaje exacto entre parentesis, y como esa fortaleza se traduce en resultados concretos para su contexto actual.

AREAS DE OPORTUNIDAD:
Tres areas numeradas como 1., 2. y 3. Cada una debe incluir: el nombre del atributo, el puntaje exacto entre parentesis, un ejemplo realista de como esa carencia puede afectar su desempenio actual, y una sugerencia inicial para empezar a trabajarla.

PLAN DE ACCION DE 30 DIAS:
Tres acciones concretas numeradas como 1., 2. y 3., cada una enfocada en una de las areas de oportunidad. Cada accion debe ser SMART y aplicable en su contexto real.

MENSAJE FINAL:
Un parrafo de 3 a 4 oraciones dirigido a la persona, con un tono motivador y realista, que reconozca su contexto particular.`;
}

// ============================================
// PROMPT 3: LIDERAZGO INTEGRAL
// ============================================
function construirPromptLiderazgo(resultado) {
    const dimensiones = resultado.resultados?.dimensiones || {};
    const perfil = resultado.resultados?.perfil || 'No determinado';
    const puntajeTotal = resultado.resultados?.puntajeTotal || 0;

    const nombresDimensiones = {
        estrategica: 'Estrategica',
        transformacional: 'Transformacional',
        operativa: 'Operativa',
        social: 'Social',
        adaptativa: 'Adaptativa',
        etica: 'Etica',
        desarrollo: 'Desarrollo de Personas'
    };

    const dimensionesConNivel = Object.entries(dimensiones).map(([key, value]) => {
        const nivel = value <= 15 ? 'Baja' : value <= 22 ? 'Media' : 'Alta';
        return { key, nombre: nombresDimensiones[key] || key, puntaje: value, nivel };
    });

    const ordenadas = [...dimensionesConNivel].sort((a, b) => b.puntaje - a.puntaje);
    const top3 = ordenadas.slice(0, 3);
    const bottom3 = ordenadas.slice(-3);

    let detalleDimensiones = dimensionesConNivel.map(d =>
        `${d.nombre}: ${d.puntaje} de 30 (nivel ${d.nivel})`
    ).join('\n');

    const { contexto, ocupacionTexto, giroTexto } = construirContexto(resultado);

    let instruccionContexto = 'Adapta los ejemplos a un contexto profesional general.';
    if (ocupacionTexto === 'emprendedor(a) o duenio(a) de negocio') {
        instruccionContexto = `Esta persona lidera su propio negocio${giroTexto ? ` en el giro de ${giroTexto}` : ''}. Enfoca los analisis hacia el liderazgo de equipos pequenios, la gestion de colaboradoras y la relacion con clientas.`;
    } else if (ocupacionTexto === 'estudiante') {
        instruccionContexto = `Esta persona es estudiante. Adapta los consejos de liderazgo a contextos academicos: equipos de proyecto, trabajos en grupo, actividades extracurriculares y liderazgo estudiantil.`;
    } else if (ocupacionTexto === 'directivo(a) o gerente') {
        instruccionContexto = `Esta persona ocupa un rol directivo. Enfoca los analisis hacia liderazgo de equipos medianos o grandes, vision estrategica organizacional y gestion del cambio.`;
    } else if (ocupacionTexto) {
        instruccionContexto = `Adapta los ejemplos y recomendaciones al contexto de una persona que trabaja como ${ocupacionTexto}${giroTexto ? ` en ${giroTexto}` : ''}.`;
    }

    return `Perfil evaluado: Liderazgo Integral (7 dimensiones gerenciales).
Persona: ${resultado.nombre}.${contexto}

PUNTAJE TOTAL: ${puntajeTotal} de 210.
PERFIL DETECTADO: ${perfil}.

DETALLE POR DIMENSION:
${detalleDimensiones}

Dimensiones mas desarrolladas: ${top3.map(t => `${t.nombre} (${t.puntaje}/30, ${t.nivel})`).join(', ')}
Dimensiones con mayor margen de mejora: ${bottom3.map(b => `${b.nombre} (${b.puntaje}/30, ${b.nivel})`).join(', ')}

INSTRUCCION ESPECIAL DE CONTEXTO:
${instruccionContexto}

TAREA:
Redacta un diagnostico integral del estilo de liderazgo de esta persona, con las siguientes seis secciones. Cada seccion inicia con su titulo en mayusculas terminado en dos puntos.

PERFIL DE LIDERAZGO:
Un parrafo de 6 a 8 oraciones que sintetice su estilo. Menciona al menos cuatro dimensiones con sus puntajes. Explica como se combinan sus fortalezas y como sus areas de mejora pueden estar limitando su efectividad en su contexto actual. Identifica que tipo de contexto laboral es su habitat natural.

FORTALEZAS PRINCIPALES:
Tres fortalezas numeradas como 1., 2. y 3. Cada una debe incluir: el nombre de la dimension, el puntaje exacto entre parentesis, y un ejemplo concreto de como se manifiesta en su comportamiento diario segun su ocupacion.

AREAS DE OPORTUNIDAD:
Tres areas numeradas como 1., 2. y 3. Cada una debe incluir: el nombre de la dimension, el puntaje exacto entre parentesis, un ejemplo realista de como esa carencia puede generar tensiones en su equipo o entorno, y una sugerencia inicial para empezar a trabajarla.

PLAN DE ACCION DE 30 DIAS:
Tres acciones concretas numeradas como 1., 2. y 3., cada una enfocada en una de las areas de oportunidad. Cada accion debe ser SMART y aplicable a su contexto laboral real.

COMO APROVECHAR TU PERFIL:
Un parrafo de 4 a 5 oraciones que explique como puede usar su perfil a su favor: que tipo de proyectos deberia buscar, que roles le convienen mejor, y que tipo de equipo le complementaria, todo segun su ocupacion y giro.

MENSAJE FINAL:
Un parrafo de 3 a 4 oraciones dirigido a la persona, con un tono motivador, honesto y profesional.`;
}