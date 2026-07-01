import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = 'https://gokulab-plataforma-de-evaluacion.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      toast.error(error.response.data?.error || 'Error en el servidor');
    } else if (error.request) {
      toast.error('Error de conexión. Verifica tu internet.');
    } else {
      toast.error('Error inesperado. Intenta nuevamente.');
    }
    return Promise.reject(error);
  }
);

const api = {
  guardarResultado: async (data) => {
    const response = await apiClient.post('/guardar', data);
    return response.data;
  },
  consultarResultados: async (nombre, tipo = '') => {
    const params = new URLSearchParams({ nombre });
    if (tipo) params.append('tipo', tipo);
    const response = await apiClient.get(`/consultar?${params}`);
    return response.data;
  }
};

export default api;