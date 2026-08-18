const Groq = require('groq-sdk');

// Lista de API keys
const API_KEYS = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
].filter(key => key && key.trim() !== '');

// Lista de modelos a probar (en orden de preferencia)
const MODELOS = [
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
    // 'llama-3.3-70b-versatile' // si llega a estar disponible, agrégalo al final
];

let currentKeyIndex = 0;

function getNextKey() {
    if (API_KEYS.length === 0) {
        throw new Error('No hay API keys de Groq configuradas');
    }
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
}

async function chatCompletion(messages, model = null, options = {}) {
    // Si no se especifica modelo, usar el primero de la lista
    const modelosAProbar = model ? [model] : MODELOS;

    let lastError = null;

    for (const modelo of modelosAProbar) {
        for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
            const apiKey = getNextKey();
            try {
                const groq = new Groq({ apiKey });
                const response = await groq.chat.completions.create({
                    messages,
                    model: modelo,
                    ...options
                });
                return response; // Éxito
            } catch (error) {
                console.error(`❌ Falló modelo ${modelo} con key ${attempt+1}:`, error.message);
                lastError = error;
                // Si el error es de modelo no encontrado o descontinuado, pasamos al siguiente modelo
                if (error.message.includes('model_not_found') || error.message.includes('decommissioned')) {
                    break; // Salir del bucle de keys y probar siguiente modelo
                }
                // Si es rate limit o auth, probar con otra key
                if (error.status === 429 || error.status === 401) {
                    continue;
                }
                // Otros errores los lanzamos
                throw error;
            }
        }
    }

    throw lastError || new Error('Todos los modelos y API keys fallaron');
}

module.exports = { chatCompletion };