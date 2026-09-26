import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = 'https://gokulab-plataforma-de-evaluacion.onrender.com/api';

const getAuth = () => {
  const stored = sessionStorage.getItem('adminUser');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(
  (config) => {
    const auth = getAuth();
    if (auth && auth.username && auth.password) {
      config.auth = {
        username: auth.username,
        password: auth.password
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('adminUser');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
      toast.error('Sesión expirada. Inicia sesión nuevamente.');
    } else if (error.response) {
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
  verificarCredenciales: async (username, password) => {
    try {
      await axios.get(`${API_BASE}/resultados/listar?page=1&limit=1`, {
        auth: { username, password }
      });
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  guardarResultado: async (data) => {
    const response = await apiClient.post('/resultados/guardar', data);
    return response.data;
  },

  consultarResultados: async (nombre, tipo = '') => {
    const params = new URLSearchParams({ nombre });
    if (tipo) params.append('tipo', tipo);
    const response = await apiClient.get(`/resultados/consultar?${params}`);
    return response.data;
  },

  listarResultados: async (page = 1, limit = 20, filtro = {}) => {
    const params = new URLSearchParams({ page, limit, ...filtro });
    const response = await apiClient.get(`/resultados/listar?${params}`);
    return response.data;
  },

  obtenerEstadisticas: async () => {
    const response = await apiClient.get('/estadisticas');
    return response.data;
  },

  generarAnalisis: async (resultadoId) => {
    const response = await apiClient.post(`/analisis/${resultadoId}`);
    return response.data;
  },

  // ===== ACTUALIZAR RESULTADO (EDITAR) =====
  actualizarResultado: async (resultadoId, datos) => {
    const response = await apiClient.put(`/resultados/${resultadoId}`, datos);
    return response.data;
  },

  // ===== ELIMINAR RESULTADO =====
  eliminarResultado: async (resultadoId) => {
    const response = await apiClient.delete(`/resultados/${resultadoId}`);
    return response.data;
  }
};

export default api;