// backend-api/services/groqService.js

const Groq = require('groq-sdk');

// Lista de API keys
const API_KEYS = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
].filter(key => key && key.trim() !== '');

// 🔥 LISTA ACTUALIZADA - Solo modelos disponibles
const MODELOS = [
    'llama-3.1-8b-instant',           // ✅ Más rápido y económico
    'llama-3.3-70b-versatile',         // ✅ Generalista robusto
    'openai/gpt-oss-120b',             // ✅ OpenAI open-source
    'deepseek-r1-distill-llama-70b',   // ✅ Razonamiento
    'meta-llama/llama-4-scout-17b-16e-instruct', // ✅ Llama 4 Scout
    'qwen/qwen3-32b',                  // ✅ Alternativa de Alibaba
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
                return response;
            } catch (error) {
                console.error(`❌ Falló modelo ${modelo} con key ${attempt+1}:`, error.message);
                lastError = error;
                if (error.message.includes('model_not_found') || 
                    error.message.includes('decommissioned')) {
                    break;
                }
                if (error.status === 429 || error.status === 401) {
                    continue;
                }
                throw error;
            }
        }
    }

    throw lastError || new Error('Todos los modelos y API keys fallaron');
}

module.exports = { chatCompletion };