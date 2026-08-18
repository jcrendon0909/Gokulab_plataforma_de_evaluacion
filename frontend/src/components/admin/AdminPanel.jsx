import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaSearch, FaUser, FaCalendar, FaTag, FaPrint,
  FaSort, FaCheckCircle, FaClock, FaRobot, FaFilter,
  FaEye, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import FormattedText from '../common/FormattedText';
import './AdminPanel.css';

const AdminPanel = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoTest, setTipoTest] = useState('todos');
  const [orden, setOrden] = useState('fecha-desc');
  const [selectedResult, setSelectedResult] = useState(null);
  const [generandoAnalisis, setGenerandoAnalisis] = useState({});

  // Redirigir al login si no autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Cargar todos los resultados al montar
  useEffect(() => {
    if (isAuthenticated) {
      cargarResultados();
    }
  }, [isAuthenticated]);

  const cargarResultados = async () => {
    setLoading(true);
    try {
      const response = await api.listarResultados(1, 100);
      setResultados(response.data || []);
    } catch (error) {
      toast.error('Error al cargar los resultados');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarAnalisis = async (resultadoId) => {
    if (generandoAnalisis[resultadoId]) return;
    setGenerandoAnalisis(prev => ({ ...prev, [resultadoId]: true }));
    try {
      const response = await api.generarAnalisis(resultadoId);
      if (response.success) {
        // Actualizar el resultado en el estado local
        setResultados(prev => prev.map(r =>
          r._id === resultadoId ? { ...r, analisis: response.analisis } : r
        ));
        toast.success('✅ Análisis generado y guardado');
      } else {
        toast.error('Error al generar el análisis');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al generar el análisis');
    } finally {
      setGenerandoAnalisis(prev => ({ ...prev, [resultadoId]: false }));
    }
  };

  // Filtrado y ordenamiento
  const getResultadosFiltrados = () => {
    let filtrados = [...resultados];
    if (tipoTest !== 'todos') {
      filtrados = filtrados.filter(r => r.tipoTest === tipoTest);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtrados = filtrados.filter(r => r.nombre.toLowerCase().includes(term));
    }
    switch (orden) {
      case 'fecha-desc':
        filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        break;
      case 'fecha-asc':
        filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        break;
      case 'nombre-asc':
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        break;
    }
    return filtrados;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading) {
    return <div className="loading-state">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const resultadosFiltrados = getResultadosFiltrados();

  return (
    <div className="admin-panel">
      <div className="container">
        <motion.div
          className="admin-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="admin-header">
            <h2>📊 Panel de Administración</h2>
            <p>Gestiona los resultados de las evaluaciones</p>
          </div>

          {/* Filtros y búsqueda */}
          <div className="filter-section">
            <div className="search-box">
              <div className="search-input-group">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <FaTag className="filter-icon" />
                <select value={tipoTest} onChange={(e) => setTipoTest(e.target.value)}>
                  <option value="todos">Todos los tests</option>
                  <option value="inteligencias">🧠 Inteligencias</option>
                  <option value="emprendedor">🚀 Emprendedor</option>
                </select>
              </div>
              <div className="filter-group">
                <FaSort className="filter-icon" />
                <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                  <option value="fecha-desc">📅 Más reciente</option>
                  <option value="fecha-asc">📅 Más antiguo</option>
                  <option value="nombre-asc">🔤 A → Z</option>
                  <option value="nombre-desc">🔤 Z → A</option>
                </select>
              </div>
              <button className="btn btn-outline" onClick={cargarResultados}>
                🔄 Actualizar
              </button>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="results-counter">
            {resultadosFiltrados.length} {resultadosFiltrados.length === 1 ? 'resultado' : 'resultados'} encontrados
          </div>

          {/* Lista de resultados */}
          <div className="results-list">
            {loading ? (
              <div className="loading-state">Cargando resultados...</div>
            ) : resultadosFiltrados.length === 0 ? (
              <div className="empty-state">
                <p>No se encontraron resultados</p>
              </div>
            ) : (
              resultadosFiltrados.map((result) => (
                <motion.div
                  key={result._id}
                  className="result-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Encabezado de resultado (siempre visible) */}
                  <div
                    className="result-header"
                    onClick={() => setSelectedResult(selectedResult === result._id ? null : result._id)}
                  >
                    <div className="result-user">
                      <FaUser />
                      <span className="result-name">{result.nombre}</span>
                      <span className="result-badge">
                        {result.tipoTest === 'inteligencias' ? '🧠' : '🚀'}
                      </span>
                    </div>
                    <div className="result-meta">
                      <span className="result-tipo">
                        {result.tipoTest === 'inteligencias' ? 'Inteligencias Múltiples' : 'Actitud Emprendedora'}
                      </span>
                      <span className="result-fecha">
                        <FaCalendar /> {formatDate(result.fecha)}
                      </span>
                      {result.analisis ? (
                        <span className="badge-success">
                          <FaCheckCircle /> Análisis listo
                        </span>
                      ) : (
                        <span className="badge-pending">
                          <FaClock /> Sin análisis
                        </span>
                      )}
                      <span className="result-expand">
                        {selectedResult === result._id ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>
                  </div>

                  {/* Detalle expandible */}
                  <AnimatePresence>
                    {selectedResult === result._id && (
                      <motion.div
                        className="result-detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Gráficas de puntajes */}
                        {result.tipoTest === 'inteligencias' ? (
                          <div className="detail-inteligencias">
                            {result.resultados.map((r, i) => (
                              <div key={i} className="detail-item">
                                <span className="detail-label">{r.tipo}</span>
                                <span className="detail-value">{r.puntaje}/8</span>
                                <div className="detail-bar">
                                  <div
                                    className="detail-fill"
                                    style={{ width: `${r.porcentaje}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                            {result.inteligenciaDominante && (
                              <div className="detail-dominante">
                                🏆 Dominante: <strong>{result.inteligenciaDominante}</strong>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="detail-emprendedor">
                            <div className="detail-total">
                              <span className="total-label">Puntaje Total:</span>
                              <span className="total-value">{result.resultados.total}/50</span>
                            </div>
                            {result.resultados.detalle?.map((attr, i) => (
                              <div key={i} className="detail-item">
                                <span className="detail-label">{attr.icono} {attr.nombre}</span>
                                <span className="detail-value">{attr.puntaje}/5</span>
                                <div className="detail-bar">
                                  <div
                                    className="detail-fill"
                                    style={{ width: `${(attr.puntaje / 5) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Análisis IA */}
                        <div className="analisis-section">
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleGenerarAnalisis(result._id)}
                            disabled={generandoAnalisis[result._id]}
                          >
                            {generandoAnalisis[result._id] ? (
                              '⏳ Generando análisis...'
                            ) : result.analisis ? (
                              '🔄 Regenerar análisis personalizado'
                            ) : (
                              '🤖 Generar análisis personalizado'
                            )}
                          </button>

                          {result.analisis && (
                            <div className="analisis-resultado">
                              <h4>📊 Análisis personalizado</h4>
                              <FormattedText text={result.analisis} />
                            </div>
                          )}
                        </div>

                        {/* Botón de impresión */}
                        <button
                          className="btn btn-outline btn-print"
                          onClick={() => window.print()}
                        >
                          <FaPrint /> Imprimir reporte
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;