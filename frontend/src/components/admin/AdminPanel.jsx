import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaSearch, FaUser, FaCalendar, FaTag, FaPrint } from 'react-icons/fa';
import api from '../../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoTest, setTipoTest] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Ingresa un nombre para buscar');
      return;
    }

    setLoading(true);
    try {
      const data = await api.consultarResultados(searchTerm, tipoTest);
      setResultados(data);
      if (data.length === 0) {
        toast('No se encontraron resultados');
      }
    } catch (error) {
      toast.error('Error al buscar');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
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
            <p>Consulta y gestiona los resultados de las evaluaciones</p>
          </div>

          <div className="search-section">
            <div className="search-box">
              <div className="search-input-group">
                <FaUser className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="search-input-group">
                <FaTag className="search-icon" />
                <select value={tipoTest} onChange={(e) => setTipoTest(e.target.value)}>
                  <option value="">Todos los tests</option>
                  <option value="inteligencias">Inteligencias Múltiples</option>
                  <option value="emprendedor">Actitud Emprendedora</option>
                </select>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Buscando...' : <><FaSearch /> Buscar</>}
              </button>
            </div>
          </div>

          <div className="results-section">
            {resultados.length > 0 ? (
              <div className="results-list">
                {resultados.map((result, index) => (
                  <motion.div
                    key={result._id || index}
                    className="result-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedResult(selectedResult === result._id ? null : result._id)}
                  >
                    <div className="result-header">
                      <div className="result-user">
                        <FaUser />
                        <span className="result-name">{result.nombre}</span>
                      </div>
                      <div className="result-meta">
                        <span className="result-tipo">
                          {result.tipoTest === 'inteligencias' ? '🧠 Inteligencias' : '🚀 Emprendedor'}
                        </span>
                        <span className="result-fecha">
                          <FaCalendar /> {formatDate(result.fecha)}
                        </span>
                      </div>
                    </div>
                    
                    {selectedResult === result._id && (
                      <motion.div 
                        className="result-detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
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
                        <button className="btn btn-outline btn-print" onClick={() => window.print()}>
                          <FaPrint /> Imprimir
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                {searchTerm ? (
                  <p>No se encontraron resultados para "{searchTerm}"</p>
                ) : (
                  <p>Ingresa un nombre para buscar resultados</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;