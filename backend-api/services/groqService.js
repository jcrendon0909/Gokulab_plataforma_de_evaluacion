// backend-api/services/groqService.js
const Groq = require('groq-sdk');

// Lista de todas tus API keys de Groq (pon las que tengas)
const API_KEYS = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    // Si tienes más, agrégalas aquí
].filter(key => key && key.trim() !== '');

// Índice para rotar las keys (round-robin)
let currentKeyIndex = 0;

// Función para obtener la siguiente key de forma circular
function getNextKey() {
    if (API_KEYS.length === 0) {
        throw new Error('No hay API keys de Groq configuradas');
    }
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
}

// Función principal que hace la petición a Groq con failover
async function chatCompletion(messages, model = 'llama3-70b-8192', options = {}) {
    const maxRetries = API_KEYS.length;
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const apiKey = getNextKey();
        try {
            const groq = new Groq({ apiKey });
            const response = await groq.chat.completions.create({
                messages,
                model,
                ...options
            });
            return response; // Si funciona, devolvemos la respuesta
        } catch (error) {
            console.error(`❌ Intento ${attempt + 1} falló:`, error.message);
            lastError = error;
            // Si es error de rate limit o autenticación, probamos con la siguiente key
            if (error.status === 429 || error.status === 401) {
                continue; // sigue con la siguiente key
            }
            // Si es otro error, lo lanzamos inmediatamente
            throw error;
        }
    }
    // Si todas las keys fallaron, lanzamos el último error
    throw lastError || new Error('Todas las API keys fallaron');
}

module.exports = { chatCompletion };