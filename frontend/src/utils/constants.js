// ============================================
// TEST DE INTELIGENCIAS MÚLTIPLES
// ============================================
export const preguntasTest1 = [
  "Los libros son muy importantes para mí",
  "Fácilmente puedo memorizar números en mi cabeza",
  "Seguido visualizo imágenes cuando cierro mis ojos",
  "Práctico por lo menos un deporte o actividad física regularmente",
  "Tengo una voz agradable al cantar",
  "Soy el tipo de persona a la que la gente busca para pedirle consejos",
  "Paso tiempo meditando, reflexionando, o pensando en cuestiones importantes",
  "Oigo palabras en mi cabeza antes de leer, hablar o escribir",
  "Las matemáticas y/o las ciencias fueron mis materias favoritas",
  "Frecuentemente uso una cámara o grabadora para captar lo que veo",
  "Me cuesta trabajo permanecer sentado durante largos períodos",
  "Me doy cuenta cuando una nota está fuera de tono",
  "Cuando tengo un problema, busco a otra persona para que me ayude",
  "Tengo opiniones que me separan de la mayoría de la gente",
  "Aprendo más de escuchar la radio o música que de ver una película",
  "Me gusta resolver juegos y acertijos que requieren pensamiento lógico",
  "Me gusta hacer rompecabezas, laberintos, acertijos visuales",
  "Me gusta trabajar con las manos en actividades concretas",
  "Frecuentemente escucho la radio, discos, etc.",
  "Tengo por lo menos 3 mejores amigos",
  "Tengo un hobby especial que mantengo para mí mismo",
  "Tengo aptitudes para juegos de palabras como Scrabble, anagramas",
  "Me gusta armar experimentos de '¿Qué pasaría si...?'",
  "Tengo sueños muy claros durante las noches",
  "Las mejores ideas se me ocurren cuando hago actividad física",
  "Toco un instrumento musical",
  "Me gustan los pasatiempos sociales más que los juegos individuales",
  "Tengo metas importantes en mi vida sobre las cuales pienso regularmente",
  "Me gusta entretenerme con trabalenguas, versos, chistes",
  "Mi mente busca patrones, regularidades o secuencias lógicas",
  "Generalmente me oriento en territorio desconocido",
  "Frecuentemente utilizo ademanes con las manos al platicar",
  "Mi vida sería más pobre si no hubiera música en ella",
  "Disfruto de los retos de enseñar a otras personas lo que sé hacer",
  "Tengo una visión realista de mis fuerzas y debilidades",
  "Las personas me piden que les explique el significado de palabras",
  "Me interesan los nuevos desarrollos de la ciencia",
  "Me gusta dibujar o garabatear",
  "Necesito tocar los objetos para entender más de ellos",
  "Fácilmente puedo llevar el compás de una selección musical",
  "Me considero un líder (u otras personas me lo han dicho)",
  "Preferiría pasar un fin de semana solo en una cabaña en el bosque",
  "El inglés y la historia fueron más fáciles para mí que las matemáticas",
  "Creo que casi todo tiene una explicación racional",
  "Me fue más fácil la geometría que el álgebra en la escuela",
  "Disfruto de las actividades atrevidas como la montaña rusa",
  "Sé la música de muchas piezas musicales y canciones",
  "Me siento a gusto en medio de un tumulto (conciertos, etc.)",
  "Me considero de ideas fijas e independientes",
  "Recientemente escribí algo de lo que estoy muy orgulloso(a)",
  "Me siento más a gusto cuando algo ha sido medido o cuantificado",
  "Prefiero leer material con muchas ilustraciones",
  "Me describiría a mí mismo como bien coordinado",
  "Si escucho una pieza musical la puedo cantar bastante bien",
  "Me gusta involucrarme en actividades sociales",
  "Llevo un diario o agenda para llevar la cuenta de mi vida personal"
];

export const tiposInteligencia = [
  'LINGÜÍSTICA', 'LÓGICA', 'ESPACIAL', 'KINESTÉSICA',
  'MUSICAL', 'INTERPERSONAL', 'INTRAPERSONAL'
];

export const matrizTest1 = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31, 32, 33, 34, 35],
  [36, 37, 38, 39, 40, 41, 42],
  [43, 44, 45, 46, 47, 48, 49],
  [50, 51, 52, 53, 54, 55, 56]
];

export const descripcionesInteligencia = {
  LINGÜÍSTICA: 'Capacidad para usar el lenguaje de manera efectiva, tanto en la escritura como en el habla. Excelente para la comunicación, persuasión y narración.',
  LÓGICA: 'Habilidad para el razonamiento lógico, la resolución de problemas matemáticos y el pensamiento científico. Destaca en análisis y sistemas complejos.',
  ESPACIAL: 'Capacidad para visualizar y manipular objetos en el espacio. Excelente para el diseño, la arquitectura y las artes visuales.',
  KINESTÉSICA: 'Habilidad para usar el cuerpo de manera coordinada. Destaca en deportes, danza, artes escénicas y actividades manuales.',
  MUSICAL: 'Capacidad para apreciar, discriminar y crear música. Sensibilidad al ritmo, tono y melodía.',
  INTERPERSONAL: 'Habilidad para entender y relacionarse con los demás. Excelente para la enseñanza, la terapia y el liderazgo.',
  INTRAPERSONAL: 'Capacidad de autoconocimiento y reflexión. Destaca en la introspección, la planificación personal y la sabiduría emocional.'
};

// ============================================
// TEST DE ACTITUD EMPRENDEDORA
// ============================================
export const atributosEmprendedores = [
  { id: 1, nombre: "Iniciativa", descripcion: "Capacidad para implementar nuevos servicios y estrategias sin esperar instrucciones", icono: "💡" },
  { id: 2, nombre: "Disciplina", descripcion: "Constancia en horarios, mantenimiento y cumplimiento de compromisos", icono: "⏰" },
  { id: 3, nombre: "Claridad de metas", descripcion: "Objetivos claros de crecimiento y posicionamiento en el mercado", icono: "🎯" },
  { id: 4, nombre: "Orden personal y operativo", descripcion: "Organización del espacio de trabajo y gestión eficiente de recursos", icono: "📋" },
  { id: 5, nombre: "Persistencia", descripcion: "Capacidad para mantener el negocio funcionando durante desafíos", icono: "💪" },
  { id: 6, nombre: "Toma de decisiones", descripcion: "Habilidad para elegir estrategias que beneficien el negocio", icono: "⚖️" },
  { id: 7, nombre: "Enfoque comercial", descripcion: "Orientación hacia la venta y fidelización de clientes", icono: "💰" },
  { id: 8, nombre: "Seguimiento a clientes", descripcion: "Atención post-servicio y construcción de relaciones duraderas", icono: "👥" },
  { id: 9, nombre: "Apertura al aprendizaje", descripcion: "Disposición para capacitarse en nuevas técnicas y tendencias", icono: "📚" },
  { id: 10, nombre: "Capacidad para resolver problemas", descripcion: "Habilidad para solucionar inconvenientes con clientes y proveedores", icono: "🔧" }
];

export const interpretacionesEmprendedor = {
  excelente: { rango: [41, 50], titulo: '🌟 Vena Emprendedora Fuerte', descripcion: 'Excelente perfil emprendedor con sólidas bases para el éxito empresarial.', recomendaciones: ['Continúa desarrollando tus fortalezas', 'Considera expandir tu negocio', 'Comparte tu conocimiento mentorando a otros'] },
  bueno: { rango: [31, 40], titulo: '💪 Buen Perfil, Necesita Estructura', descripcion: 'Tienes un potencial emprendedor significativo, pero necesitas mayor organización.', recomendaciones: ['Implementa sistemas de gestión', 'Establece rutinas claras', 'Busca capacitación en áreas débiles'] },
  potencial: { rango: [21, 30], titulo: '🌱 Potencial Presente, Hábitos Débiles', descripcion: 'Muestras interés y potencial, pero necesitas fortalecer hábitos.', recomendaciones: ['Trabaja en disciplina diaria', 'Establece metas medibles', 'Busca un mentor'] },
  inicial: { rango: [0, 20], titulo: '🚀 Etapa Inicial, Requiere Bases', descripcion: 'Te encuentras en las primeras etapas del desarrollo emprendedor.', recomendaciones: ['Busca capacitación básica', 'Desarrolla hábitos fundamentales', 'Comienza con metas pequeñas'] }
};

// ============================================
// TEST DE LIDERAZGO INTEGRAL (NUEVO)
// ============================================
export const preguntasLiderazgo = [
  // Estratégica (1-6)
  "Defino objetivos de largo plazo para mi equipo.",
  "Analizo cómo cada decisión afecta al resto de la organización.",
  "Distingo lo urgente de lo importante.",
  "Elaboro planes claros para alcanzar metas.",
  "Identifico riesgos antes de actuar.",
  "Tomo decisiones basadas en datos y evidencia.",
  // Transformacional (7-12)
  "Motivo a otros a dar lo mejor de sí.",
  "Promuevo ideas nuevas y creativas.",
  "Transformo procesos para mejorar.",
  "Conecto el trabajo diario con un propósito mayor.",
  "Transmito entusiasmo y optimismo.",
  "Uso historias para motivar.",
  // Operativa (13-18)
  "Verifico que las tareas se cumplan.",
  "Me aseguro de que se sigan los procesos.",
  "Reviso avances constantemente.",
  "Me enfoco en cumplir metas inmediatas.",
  "Corrijo errores rápidamente.",
  "Mantengo disciplina y estructura.",
  // Social (19-24)
  "Comprendo las emociones de los demás.",
  "Expreso ideas con claridad.",
  "Presto atención genuina a las personas.",
  "Convenzo sin imponer.",
  "Manejo desacuerdos de forma constructiva.",
  "Construyo vínculos de confianza.",
  // Adaptativa (25-30)
  "Me adapto a cambios inesperados.",
  "Mantengo la calma bajo presión.",
  "Busco aprender constantemente.",
  "Encuentro soluciones diferentes.",
  "Guío a otros durante cambios.",
  "Cambio de estrategia cuando es necesario.",
  // Ética (31-36)
  "Trato a todos con equidad.",
  "Actúo conforme a mis valores.",
  "Asumo consecuencias de mis decisiones.",
  "Comunico con honestidad.",
  "Mis acciones reflejan mis principios.",
  "Genero credibilidad.",
  // Desarrollo de Personas (37-42)
  "Ayudo a otros a mejorar.",
  "Comparto experiencia para guiar.",
  "Delego para desarrollar talento.",
  "Doy retroalimentación útil.",
  "Impulso el desarrollo del equipo.",
  "Doy autonomía y confianza."
];

export const dimensionesLiderazgo = [
  { id: 'estrategica', label: 'Estratégica', icon: '🎯', color: '#26aaa3', preguntas: [0,1,2,3,4,5] },
  { id: 'transformacional', label: 'Transformacional', icon: '🔥', color: '#f8b50e', preguntas: [6,7,8,9,10,11] },
  { id: 'operativa', label: 'Operativa', icon: '⚙️', color: '#67a934', preguntas: [12,13,14,15,16,17] },
  { id: 'social', label: 'Social', icon: '🤝', color: '#4a90d9', preguntas: [18,19,20,21,22,23] },
  { id: 'adaptativa', label: 'Adaptativa', icon: '🌀', color: '#9b59b6', preguntas: [24,25,26,27,28,29] },
  { id: 'etica', label: 'Ética', icon: '⚖️', color: '#e67e22', preguntas: [30,31,32,33,34,35] },
  { id: 'desarrollo', label: 'Desarrollo de Personas', icon: '🌱', color: '#e74c3c', preguntas: [36,37,38,39,40,41] }
];

export const perfilesLiderazgo = {
  'Líder Integral': 'Alto desempeño en todas las inteligencias de liderazgo. Eres un líder completo, capaz de inspirar, ejecutar, conectar y adaptarte.',
  'Líder Estratégico': 'Fuerte visión, ética sólida y foco en desarrollo de personas. Destacas en planificar el futuro y guiar a otros hacia metas ambiciosas.',
  'Líder Transformacional': 'Inspiras, movilizas el cambio y gestionas bien la adaptación. Tu energía y creatividad contagian al equipo.',
  'Líder Funcional': 'Combina ejecución operativa con buena inteligencia social. Eres efectivo tanto en el día a día como en las relaciones interpersonales.',
  'Jefe Operativo': 'Fuerte en control y ejecución, con oportunidad de crecimiento en lo social y desarrollo de personas. Puedes evolucionar hacia un liderazgo más integral.',
  'Perfil Mixto': 'Combina rasgos de jefe y líder. Recomendable trabajar en visión estratégica, desarrollo de personas y habilidades sociales para consolidar un liderazgo más integral.'
};

export function clasificarNivelLiderazgo(puntaje) {
  if (puntaje <= 15) return 'Baja';
  if (puntaje <= 22) return 'Media';
  return 'Alta';
}

export function obtenerPerfilLiderazgo(dimensiones) {
  const { estrategica, transformacional, operativa, social, adaptativa, etica, desarrollo } = dimensiones;

  const todasAltas = Object.values(dimensiones).every(v => v >= 23);
  if (todasAltas) return 'Líder Integral';

  if (estrategica >= 23 && etica >= 23 && desarrollo >= 23) return 'Líder Estratégico';
  if (transformacional >= 23 && social >= 23 && adaptativa >= 23) return 'Líder Transformacional';
  if (operativa >= 23 && social >= 23 && estrategica >= 16) return 'Líder Funcional';
  if (operativa >= 23 && social <= 22 && desarrollo <= 22) return 'Jefe Operativo';
  return 'Perfil Mixto';
}