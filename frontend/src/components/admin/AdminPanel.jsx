import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaSearch, FaUser, FaCalendar, FaTag, FaSort,
  FaCheckCircle, FaClock, FaTrash, FaPrint
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import FormattedText from '../common/FormattedText';
import './AdminPanel.css';

const AdminPanel = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [tipoTest, setTipoTest] = useState('todos');
  const [orden, setOrden] = useState('fecha-desc');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [generandoAnalisis, setGenerandoAnalisis] = useState({});
  const [eliminando, setEliminando] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

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

  // ===== ELIMINAR REGISTRO =====
  const handleEliminar = async (resultadoId) => {
    setEliminando(prev => ({ ...prev, [resultadoId]: true }));
    try {
      const response = await api.eliminarResultado(resultadoId);
      if (response.success) {
        setResultados(prev => prev.filter(r => r._id !== resultadoId));
        toast.success('🗑️ Registro eliminado exitosamente');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al eliminar el registro');
    } finally {
      setEliminando(prev => ({ ...prev, [resultadoId]: false }));
      setConfirmDelete(null);
    }
  };

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
      case 'fecha-desc': filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); break;
      case 'fecha-asc': filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); break;
      case 'nombre-asc': filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
      case 'nombre-desc': filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre)); break;
      default: break;
    }
    return filtrados;
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  // ===== MAPA DE OCUPACIONES PARA ETIQUETAS LEGIBLES =====
  const mapaOcupacionLabels = {
    estudiante: 'Estudiante',
    empleado: 'Empleado(a) / Colaborador(a)',
    emprendedor: 'Emprendedor(a) / Dueño(a) de negocio',
    freelancer: 'Freelancer / Independiente',
    directivo: 'Directivo(a) / Gerente',
    docente: 'Docente / Instructor(a)',
    hogar: 'Labores del hogar',
    buscando: 'Buscando oportunidad',
    otro: 'Otro'
  };

  if (authLoading) return <div className="loading-state">Cargando...</div>;
  if (!isAuthenticated) return null;

  const resultadosFiltrados = getResultadosFiltrados();

  return (
    <div className="admin-panel">
      <div className="container">
        <motion.div className="admin-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-header">
            <h2>📊 Panel de Administración</h2>
            <p>Gestiona los resultados de las evaluaciones</p>
          </div>

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
                  <option value="liderazgo">👥 Liderazgo</option>
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
              <button className="btn btn-outline" onClick={cargarResultados}>🔄 Actualizar</button>
            </div>
          </div>

          <div className="results-counter">{resultadosFiltrados.length} resultados encontrados</div>

          <div className="results-list">
            {loading ? (
              <div className="loading-state">Cargando resultados...</div>
            ) : resultadosFiltrados.length === 0 ? (
              <div className="empty-state"><p>No se encontraron resultados</p></div>
            ) : (
              resultadosFiltrados.map((result) => (
                <motion.div
                  key={result._id}
                  className="result-item"
                  onClick={() => setSelectedResult(selectedResult === result._id ? null : result._id)}
                >
                  <div className="result-header">
                    <div className="result-user">
                      <FaUser />
                      <div className="result-user-info">
                        <span className="result-name">{result.nombre}</span>
                        {result.email && (
                          <a
                            href={`mailto:${result.email}?cc=contacto@gokulab.mx&subject=Interpretación de tu test - GŌKU LAB&body=Hola ${result.nombre},%0D%0A%0D%0AGracias por realizar el test en GŌKU LAB. Adjunto encontrarás la interpretación completa de tus resultados.%0D%0A%0D%0ASaludos cordiales,%0D%0AEquipo GŌKU LAB`}
                            className="result-email"
                            onClick={(e) => e.stopPropagation()}
                            title={`Enviar correo a ${result.email}`}
                          >
                            ✉️ {result.email}
                          </a>
                        )}
                        {result.ocupacion && (
                          <span className="result-ocupacion">
                            💼 {mapaOcupacionLabels[result.ocupacion] || result.ocupacion}
                            {result.giroEspecifico ? ` · ${result.giroEspecifico}` : ''}
                            {result.edad ? ` · ${result.edad} años` : ''}
                          </span>
                        )}
                      </div>
                      <span className="result-badge">
                        {result.tipoTest === 'inteligencias' ? '🧠' : result.tipoTest === 'emprendedor' ? '🚀' : '👥'}
                      </span>
                    </div>
                    <div className="result-meta">
                      <span className="result-tipo">
                        {result.tipoTest === 'inteligencias' ? 'Inteligencias Múltiples' :
                         result.tipoTest === 'emprendedor' ? 'Actitud Emprendedora' : 'Liderazgo Integral'}
                      </span>
                      <span className="result-fecha"><FaCalendar /> {formatDate(result.fecha)}</span>
                      {result.analisis ? (
                        <span className="badge-success"><FaCheckCircle /> Análisis listo</span>
                      ) : (
                        <span className="badge-pending"><FaClock /> Sin análisis</span>
                      )}
                      {/* ===== BOTÓN ELIMINAR ===== */}
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(result);
                        }}
                        title="Eliminar registro"
                      >
                        <FaTrash />
                      </button>
                      <span className="result-expand">{selectedResult === result._id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedResult === result._id && (
                      <motion.div
                        className="result-detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {result.tipoTest === 'inteligencias' ? (
                          <div className="detail-inteligencias">
                            {result.resultados.map((r, i) => (
                              <div key={i} className="detail-item">
                                <span className="detail-label">{r.tipo}</span>
                                <span className="detail-value">{r.puntaje}/8</span>
                                <div className="detail-bar"><div className="detail-fill" style={{ width: `${r.porcentaje}%` }} /></div>
                              </div>
                            ))}
                            {result.inteligenciaDominante && (
                              <div className="detail-dominante">🏆 Dominante: <strong>{result.inteligenciaDominante}</strong></div>
                            )}
                          </div>
                        ) : result.tipoTest === 'emprendedor' ? (
                          <div className="detail-emprendedor">
                            <div className="detail-total">
                              <span className="total-label">Puntaje Total:</span>
                              <span className="total-value">{result.resultados.total}/50</span>
                            </div>
                            {result.resultados.detalle?.map((attr, i) => (
                              <div key={i} className="detail-item">
                                <span className="detail-label">{attr.icono} {attr.nombre}</span>
                                <span className="detail-value">{attr.puntaje}/5</span>
                                <div className="detail-bar"><div className="detail-fill" style={{ width: `${(attr.puntaje / 5) * 100}%` }} /></div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="detail-liderazgo">
                            <div className="detail-total">
                              <span className="total-label">Puntaje Total:</span>
                              <span className="total-value">{result.resultados.puntajeTotal}/210</span>
                            </div>
                            <div className="detail-perfil"><strong>Perfil:</strong> {result.resultados.perfil}</div>
                            <div className="detail-descripcion"><p>{result.resultados.descripcion || ''}</p></div>
                            {result.resultados.detalle?.map((dim, i) => (
                              <div key={i} className="detail-item">
                                <span className="detail-label">{dim.icon} {dim.label}</span>
                                <span className="detail-value">{dim.puntaje}/30</span>
                                <div className="detail-bar">
                                  <div className="detail-fill" style={{ width: `${(dim.puntaje / 30) * 100}%`, background: dim.color || '#26aaa3' }} />
                                </div>
                                <span className="detail-nivel" style={{ fontSize: '0.75rem', color: '#666' }}>({dim.nivel})</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="analisis-section">
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleGenerarAnalisis(result._id)}
                            disabled={generandoAnalisis[result._id]}
                          >
                            {generandoAnalisis[result._id] ? '⏳ Generando...' : result.analisis ? '🔄 Regenerar análisis' : '🤖 Generar análisis personalizado'}
                          </button>
                          {result.analisis && (
                            <div className="analisis-resultado">
                              <h4>📊 Análisis personalizado</h4>
                              <FormattedText text={result.analisis} />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* ===== MODAL DE CONFIRMACIÓN ===== */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <motion.div
            className="modal-confirm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon">🗑️</div>
            <h3>¿Eliminar registro?</h3>
            <p>
              Estás a punto de eliminar el registro de <strong>{confirmDelete.nombre}</strong>.
              <br />
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setConfirmDelete(null)}
                disabled={eliminando[confirmDelete._id]}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleEliminar(confirmDelete._id)}
                disabled={eliminando[confirmDelete._id]}
              >
                {eliminando[confirmDelete._id] ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;