import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSearch, FaUser, FaCalendar, FaTag, FaPrint, FaSort, FaCheckCircle, FaClock } from 'react-icons/fa';
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

  // ===== NUEVA FUNCIÓN: GENERAR REPORTE EN VENTANA NUEVA =====
  const generarReporte = (resultado) => {
    // Crear una ventana nueva
    const ventana = window.open('', '_blank', 'width=800,height=600');
    if (!ventana) {
      toast.error('Permite ventanas emergentes para generar el reporte');
      return;
    }

    // Construir el HTML del reporte
    const html = generarHTMLReporte(resultado);
    ventana.document.write(html);
    ventana.document.close();
    ventana.focus();
    // Esperar a que cargue y luego imprimir
    ventana.onload = function() {
      ventana.print();
    };
  };

  // ===== FUNCIÓN PARA GENERAR EL HTML DEL REPORTE =====
  const generarHTMLReporte = (resultado) => {
    const fechaFormateada = formatDate(resultado.fecha);
    const esInteligencias = resultado.tipoTest === 'inteligencias';

    // Construir las barras de progreso
    let detallesHTML = '';
    if (esInteligencias) {
      detallesHTML = resultado.resultados.map((r, i) => `
        <div class="detail-item">
          <span class="detail-label">${r.tipo}</span>
          <span class="detail-value">${r.puntaje}/8</span>
          <div class="detail-bar">
            <div class="detail-fill" style="width: ${r.porcentaje}%;"></div>
          </div>
        </div>
      `).join('');
    } else {
      detallesHTML = `
        <div class="detail-total">
          <span class="total-label">Puntaje Total:</span>
          <span class="total-value">${resultado.resultados.total}/50</span>
        </div>
        ${resultado.resultados.detalle?.map((attr, i) => `
          <div class="detail-item">
            <span class="detail-label">${attr.icono || ''} ${attr.nombre}</span>
            <span class="detail-value">${attr.puntaje}/5</span>
            <div class="detail-bar">
              <div class="detail-fill" style="width: ${(attr.puntaje / 5) * 100}%;"></div>
            </div>
          </div>
        `).join('')}
      `;
    }

    // Análisis (si existe)
    const analisisHTML = resultado.analisis ? `
      <div class="analisis-section">
        <h3>📊 Análisis personalizado</h3>
        <div class="analisis-contenido">
          ${resultado.analisis.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Evaluación - ${resultado.nombre}</title>
        <style>
          /* ===== RESET ===== */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Times New Roman', Times, serif;
            background: white;
            color: #1a1a2e;
            padding: 40px 50px;
            line-height: 1.6;
          }
          .reporte {
            max-width: 900px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #26aaa3;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .header h1 {
            font-size: 28pt;
            color: #26aaa3;
            letter-spacing: 1px;
          }
          .header .slogan {
            font-size: 14pt;
            color: #555;
          }
          .header .slogan span { font-weight: 700; }
          .header .slogan .juega { color: #f8b50e; }
          .header .slogan .aprende { color: #d61a1f; }
          .header .slogan .emprende { color: #67a934; }

          .info-usuario {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 12pt;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          .info-usuario .nombre { font-weight: 700; font-size: 14pt; }

          .titulo-seccion {
            font-size: 16pt;
            font-weight: 700;
            margin: 20px 0 10px 0;
            color: #26aaa3;
            border-bottom: 2px solid #26aaa3;
            padding-bottom: 5px;
          }

          .detail-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 5px 0;
          }
          .detail-label {
            min-width: 120px;
            font-weight: 600;
            font-size: 11pt;
          }
          .detail-value {
            font-weight: 600;
            min-width: 50px;
            text-align: right;
            font-size: 11pt;
          }
          .detail-bar {
            flex: 1;
            height: 10px;
            background: #e9ecef;
            border-radius: 5px;
            overflow: hidden;
          }
          .detail-fill {
            height: 100%;
            background: #26aaa3;
            border-radius: 5px;
          }

          .detail-total {
            background: #f5f5f5;
            padding: 10px 15px;
            border-radius: 5px;
            margin-bottom: 10px;
            display: flex;
            gap: 20px;
            align-items: center;
          }
          .total-label { font-weight: 600; }
          .total-value { font-weight: 700; font-size: 16pt; color: #d61a1f; }

          .dominante {
            background: #fffcf0;
            border: 1px solid #f8b50e;
            padding: 10px 15px;
            border-radius: 5px;
            margin: 15px 0;
            text-align: center;
            font-size: 12pt;
          }
          .dominante strong { color: #f8b50e; }

          .analisis-section {
            margin-top: 25px;
            border-top: 2px solid #ddd;
            padding-top: 15px;
          }
          .analisis-section h3 {
            color: #26aaa3;
            font-size: 14pt;
            margin-bottom: 10px;
          }
          .analisis-contenido p {
            margin: 8px 0;
            text-align: justify;
            font-size: 11pt;
            line-height: 1.6;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10pt;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }

          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="reporte">
          <div class="header">
            <h1>GŌKU LAB</h1>
            <div class="slogan">
              <span class="juega">Juega</span>
              <span class="aprende">Aprende</span>
              <span class="emprende">Emprende</span>
            </div>
          </div>

          <div class="info-usuario">
            <span class="nombre">${resultado.nombre}</span>
            <span>${fechaFormateada}</span>
          </div>

          <div class="titulo-seccion">
            ${esInteligencias ? '🧠 Inteligencias Múltiples' : '🚀 Actitud Emprendedora'}
          </div>

          ${detallesHTML}

          ${esInteligencias && resultado.inteligenciaDominante ? `
            <div class="dominante">
              🏆 Inteligencia Dominante: <strong>${resultado.inteligenciaDominante}</strong>
            </div>
          ` : ''}

          ${analisisHTML}

          <div class="footer">
            © ${new Date().getFullYear()} GŌKU LAB · Reporte generado automáticamente
          </div>
        </div>
      </body>
      </html>
    `;
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
                <motion.div key={result._id} className="result-item" onClick={() => setSelectedResult(selectedResult === result._id ? null : result._id)}>
                  <div className="result-header">
                    <div className="result-user">
                      <FaUser />
                      <span className="result-name">{result.nombre}</span>
                      <span className="result-badge">{result.tipoTest === 'inteligencias' ? '🧠' : '🚀'}</span>
                    </div>
                    <div className="result-meta">
                      <span className="result-tipo">{result.tipoTest === 'inteligencias' ? 'Inteligencias Múltiples' : 'Actitud Emprendedora'}</span>
                      <span className="result-fecha"><FaCalendar /> {formatDate(result.fecha)}</span>
                      {result.analisis ? (
                        <span className="badge-success"><FaCheckCircle /> Análisis listo</span>
                      ) : (
                        <span className="badge-pending"><FaClock /> Sin análisis</span>
                      )}
                      <span className="result-expand">{selectedResult === result._id ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {selectedResult === result._id && (
                      <motion.div className="result-detail" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
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
                        ) : (
                          <div className="detail-emprendedor">
                            <div className="detail-total"><span className="total-label">Puntaje Total:</span><span className="total-value">{result.resultados.total}/50</span></div>
                            {result.resultados.detalle?.map((attr, i) => (
                              <div key={i} className="detail-item">
                                <span className="detail-label">{attr.icono} {attr.nombre}</span>
                                <span className="detail-value">{attr.puntaje}/5</span>
                                <div className="detail-bar"><div className="detail-fill" style={{ width: `${(attr.puntaje / 5) * 100}%` }} /></div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="analisis-section">
                          <button className="btn btn-secondary" onClick={() => handleGenerarAnalisis(result._id)} disabled={generandoAnalisis[result._id]}>
                            {generandoAnalisis[result._id] ? '⏳ Generando...' : result.analisis ? '🔄 Regenerar análisis' : '🤖 Generar análisis personalizado'}
                          </button>
                          {result.analisis && (
                            <div className="analisis-resultado">
                              <h4>📊 Análisis personalizado</h4>
                              <FormattedText text={result.analisis} />
                            </div>
                          )}
                        </div>
                        {/* ===== BOTÓN DE IMPRIMIR MODIFICADO ===== */}
                        <button className="btn btn-outline btn-print" onClick={() => generarReporte(result)}>
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