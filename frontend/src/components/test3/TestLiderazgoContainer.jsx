import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaArrowRight, FaUsers } from 'react-icons/fa';
import {
  preguntasLiderazgo,
  dimensionesLiderazgo,
  clasificarNivelLiderazgo,
  obtenerPerfilLiderazgo,
  perfilesLiderazgo
} from '../../utils/constants';
import api from '../../services/api';
import './TestLiderazgoContainer.css';

const TestLiderazgoContainer = ({ setUserData, userData }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [userInfo, setUserInfo] = useState({
    nombre: userData?.nombre || '',
    email: userData?.email || '',
    edad: ''
  });
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalDimensiones = dimensionesLiderazgo.length;
  const dimensionActual = dimensionesLiderazgo[currentDimensionIndex];
  const preguntasDimension = dimensionActual?.preguntas.map(idx => preguntasLiderazgo[idx]) || [];

  useEffect(() => {
    const inicial = {};
    preguntasLiderazgo.forEach((_, index) => {
      inicial[index] = null;
    });
    setRespuestas(inicial);
  }, []);

  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleRespuesta = (index, value) => {
    setRespuestas(prev => ({ ...prev, [index]: parseInt(value) }));
  };

  const calcularResultados = () => {
    const puntajes = {};
    dimensionesLiderazgo.forEach(dim => {
      let sum = 0;
      dim.preguntas.forEach(idx => {
        sum += respuestas[idx] || 0;
      });
      puntajes[dim.id] = sum;
    });

    const total = Object.values(puntajes).reduce((a, b) => a + b, 0);
    const perfil = obtenerPerfilLiderazgo(puntajes);
    const descripcion = perfilesLiderazgo[perfil] || 'Perfil no definido';

    return {
      dimensiones: puntajes,
      puntajeTotal: total,
      perfil,
      descripcion,
      detalle: dimensionesLiderazgo.map(dim => ({
        id: dim.id,
        label: dim.label,
        icon: dim.icon,
        color: dim.color,
        puntaje: puntajes[dim.id],
        nivel: clasificarNivelLiderazgo(puntajes[dim.id])
      }))
    };
  };

  const handleEnviarResultados = async () => {
    if (!userInfo.nombre || !userInfo.email || !userInfo.edad) {
      toast.error('Por favor completa todos tus datos');
      return;
    }

    const todasRespondidas = Object.values(respuestas).every(v => v !== null);
    if (!todasRespondidas) {
      toast.error('Responde todas las preguntas para obtener un perfil válido');
      return;
    }

    setIsLoading(true);
    const resultadosCalculados = calcularResultados();

    try {
      const data = {
        nombre: userInfo.nombre.trim(),
        email: userInfo.email.trim(),
        edad: parseInt(userInfo.edad),
        tipoTest: 'liderazgo',
        resultados: {
          dimensiones: resultadosCalculados.dimensiones,
          puntajeTotal: resultadosCalculados.puntajeTotal,
          perfil: resultadosCalculados.perfil,
          descripcion: resultadosCalculados.descripcion,
          detalle: resultadosCalculados.detalle
        }
      };

      const response = await api.guardarResultado(data);
      if (response.success || response.warning) {
        setUserData({ nombre: userInfo.nombre, email: userInfo.email });
        localStorage.setItem('gokulab_user', JSON.stringify({
          nombre: userInfo.nombre,
          email: userInfo.email
        }));
        setResultados(resultadosCalculados);
        setCurrentStep(2);
        toast.success('¡Resultados guardados exitosamente!');
      }
    } catch (error) {
      toast.error('Error al guardar los resultados');
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDERIZADO ---
  if (currentStep === 0) {
    return (
      <div className="test-liderazgo-container">
        <div className="container">
          <motion.div
            className="step-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="step-header">
              <div className="step-icon"><FaUsers /></div>
              <h2 className="step-title">👥 Test de Liderazgo Integral</h2>
            </div>
            <p className="step-description">
              Descubre tu perfil de liderazgo en 7 dimensiones clave. Este test te ayudará a identificar tus fortalezas y áreas de desarrollo como líder.
            </p>
            <div className="info-box">
              <h4>📝 Instrucciones</h4>
              <ul>
                <li>✓ Responde todas las preguntas con honestidad.</li>
                <li>✓ Piensa en tu comportamiento habitual en el trabajo o equipo.</li>
                <li>✓ Escala: 1 = Casi nunca, 2 = Rara vez, 3 = A veces, 4 = Frecuentemente, 5 = Casi siempre.</li>
                <li>✓ El test consta de 7 dimensiones con 6 preguntas cada una.</li>
              </ul>
            </div>
            <div className="form-section">
              <h4>📋 Datos Personales</h4>
              <div className="form-grid">
                <div className="input-group">
                  <label>Nombre Completo *</label>
                  <input type="text" name="nombre" value={userInfo.nombre} onChange={handleUserInfoChange} placeholder="Tu nombre completo" />
                </div>
                <div className="input-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={userInfo.email} onChange={handleUserInfoChange} placeholder="tu@email.com" />
                </div>
                <div className="input-group">
                  <label>Edad *</label>
                  <input type="number" name="edad" value={userInfo.edad} onChange={handleUserInfoChange} placeholder="Tu edad" min="5" max="99" />
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => setCurrentStep(1)}
              disabled={!userInfo.nombre || !userInfo.email || !userInfo.edad}
            >
              Comenzar Test <FaArrowRight />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (currentStep === 1) {
    const totalPreguntas = preguntasLiderazgo.length;
    const respondidas = Object.values(respuestas).filter(v => v !== null).length;
    const progreso = Math.round((respondidas / totalPreguntas) * 100);
    const dimensionProgress = ((currentDimensionIndex + 1) / totalDimensiones) * 100;

    return (
      <div className="test-liderazgo-container">
        <div className="container">
          <motion.div
            className="step-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="progress-header">
              <div className="progress-info">
                <span>📊 Dimensión {currentDimensionIndex + 1} de {totalDimensiones}: {dimensionActual.label}</span>
                <span>{respondidas}/{totalPreguntas} preguntas</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progreso}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="progress-bar dimension-progress">
                <motion.div
                  className="progress-fill"
                  style={{ background: dimensionActual.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dimensionProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="dimension-header" style={{ borderColor: dimensionActual.color }}>
              <h3>{dimensionActual.icon} {dimensionActual.label}</h3>
              <p>Responde las siguientes 6 preguntas sobre tu comportamiento habitual.</p>
            </div>

            <div className="questions-container">
              {preguntasDimension.map((pregunta, localIndex) => {
                const globalIndex = dimensionActual.preguntas[localIndex];
                return (
                  <div key={globalIndex} className="question-item">
                    <div className="question-text">{localIndex + 1}. {pregunta}</div>
                    <div className="scale-options">
                      {[1, 2, 3, 4, 5].map(val => (
                        <label key={val} className={`scale-option ${respuestas[globalIndex] === val ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name={`q${globalIndex}`}
                            value={val}
                            checked={respuestas[globalIndex] === val}
                            onChange={() => handleRespuesta(globalIndex, val)}
                          />
                          <span>{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="navigation-buttons">
              <button
                className="btn btn-outline"
                onClick={() => {
                  if (currentDimensionIndex > 0) {
                    setCurrentDimensionIndex(currentDimensionIndex - 1);
                  } else {
                    setCurrentStep(0);
                  }
                }}
              >
                <FaArrowLeft /> {currentDimensionIndex > 0 ? 'Anterior dimensión' : 'Atrás'}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const todasRespondidasDimension = dimensionActual.preguntas.every(idx => respuestas[idx] !== null);
                  if (!todasRespondidasDimension) {
                    toast.error('Responde todas las preguntas de esta dimensión');
                    return;
                  }
                  if (currentDimensionIndex < totalDimensiones - 1) {
                    setCurrentDimensionIndex(currentDimensionIndex + 1);
                  } else {
                    handleEnviarResultados();
                  }
                }}
                disabled={isLoading}
              >
                {currentDimensionIndex < totalDimensiones - 1 ? (
                  <>Siguiente dimensión <FaArrowRight /></>
                ) : (
                  isLoading ? 'Guardando...' : 'Ver Resultados'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Resultados
  return (
    <div className="test-liderazgo-container">
      <div className="container">
        <motion.div
          className="step-container results-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="results-header">
            <h2 className="results-title">🎯 ¡Perfil de Liderazgo!</h2>
            <p className="results-subtitle">{userInfo.nombre}, aquí están tus resultados</p>
          </div>

          <div className="puntaje-total-liderazgo">
            <div className="puntaje-numero">{resultados.puntajeTotal}/210</div>
            <div className="puntaje-categoria">{resultados.perfil}</div>
          </div>

          <div className="results-grid-liderazgo">
            {resultados.detalle.map((dim, index) => (
              <motion.div
                key={dim.id}
                className="result-card-liderazgo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="dim-icon">{dim.icon}</div>
                <h4>{dim.label}</h4>
                <div className="score">{dim.puntaje}/30</div>
                <div className="nivel">{dim.nivel}</div>
                <div className="mini-bar-liderazgo">
                  <motion.div
                    className="mini-fill-liderazgo"
                    style={{ background: dim.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(dim.puntaje / 30) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.08 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="perfil-descripcion">
            <h4>📌 Perfil de liderazgo</h4>
            <p>{resultados.descripcion}</p>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => navigate('/')}>🏠 Inicio</button>
            <button className="btn btn-secondary" onClick={() => window.print()}>🖨️ Imprimir</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestLiderazgoContainer;