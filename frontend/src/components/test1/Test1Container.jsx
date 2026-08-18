import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaBrain } from 'react-icons/fa';
import { preguntasTest1, matrizTest1, tiposInteligencia, descripcionesInteligencia } from '../../utils/constants';
import api from '../../services/api';
import './Test1Container.css';

const Test1Container = ({ setUserData, userData }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    nombre: userData?.nombre || '',
    email: userData?.email || '',
    edad: ''
  });
  const [respuestas, setRespuestas] = useState([]);
  const [resultados, setResultados] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nivelConfianza, setNivelConfianza] = useState(null);

  useEffect(() => {
    setRespuestas(new Array(preguntasTest1.length).fill(false));
  }, []);

  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const toggleRespuesta = (index) => {
    const nuevas = [...respuestas];
    nuevas[index] = !nuevas[index];
    setRespuestas(nuevas);
  };

  const calcularResultados = () => {
    const puntajes = new Array(7).fill(0);
    
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 8; row++) {
        const numero = matrizTest1[row][col];
        if (respuestas[numero - 1]) {
          puntajes[col]++;
        }
      }
    }

    const maxPuntaje = Math.max(...puntajes);
    const indiceDominante = puntajes.indexOf(maxPuntaje);
    const inteligenciaDominante = tiposInteligencia[indiceDominante];

    const resultadosDetalle = tiposInteligencia.map((tipo, index) => ({
      tipo,
      puntaje: puntajes[index],
      porcentaje: (puntajes[index] / 8) * 100,
      descripcion: descripcionesInteligencia[tipo]
    }));

    return {
      puntajes,
      inteligenciaDominante,
      resultadosDetalle,
      maxPuntaje,
      indiceDominante
    };
  };

  const handleEnviarResultados = async () => {
    if (!userInfo.nombre || !userInfo.email || !userInfo.edad) {
      toast.error('Por favor completa todos tus datos');
      return;
    }

    if (userInfo.edad < 5 || userInfo.edad > 99) {
      toast.error('La edad debe estar entre 5 y 99 años');
      return;
    }

    const respondidas = respuestas.filter(r => r).length;
    const totalPreguntas = preguntasTest1.length;
    const porcentajeRespuestas = Math.round((respondidas / totalPreguntas) * 100);

    // Calcular nivel de confianza
    let nivel = '';
    let color = '';
    let mensaje = '';
    if (porcentajeRespuestas >= 75) {
      nivel = 'Alta';
      color = '#27ae60';
      mensaje = 'Excelente, tu perfil es muy completo y confiable.';
    } else if (porcentajeRespuestas >= 50) {
      nivel = 'Media';
      color = '#f39c12';
      mensaje = 'Buen avance. Si quieres un perfil más preciso, intenta responder algunas preguntas adicionales.';
    } else {
      nivel = 'Baja (Preliminar)';
      color = '#e67e22';
      mensaje = 'Este es un resultado orientativo. Te invitamos a reflexionar sobre las preguntas que dejaste sin marcar para obtener un perfil más detallado.';
    }

    setNivelConfianza({
      nivel,
      color,
      mensaje,
      porcentaje: porcentajeRespuestas,
      respondidas,
      total: totalPreguntas
    });

    setIsLoading(true);
    const resultadosCalculados = calcularResultados();

    try {
      const data = {
        nombre: userInfo.nombre.trim(),
        email: userInfo.email.trim(),
        edad: parseInt(userInfo.edad),
        tipoTest: 'inteligencias',
        resultados: resultadosCalculados.resultadosDetalle,
        inteligenciaDominante: resultadosCalculados.inteligenciaDominante,
        metadata: {
          totalRespondidas: respondidas,
          totalPreguntas: totalPreguntas,
          porcentaje: porcentajeRespuestas,
          nivelConfianza: nivel
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
        
        if (response.warning) {
          toast.success('Resultados guardados (ya existía un registro reciente)');
        } else {
          toast.success('¡Resultados guardados exitosamente!');
        }
      }
    } catch (error) {
      toast.error('Error al guardar los resultados');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado de pasos
  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <motion.div 
            className="step-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="step-header">
              <div className="step-icon"><FaBrain /></div>
              <h2 className="step-title">🧠 Test de Inteligencias Múltiples</h2>
            </div>
            
            <p className="step-description">
              Descubre cuáles son tus inteligencias predominantes según la teoría de Howard Gardner.
            </p>
            
            {/* ===== INSTRUCCIONES MEJORADAS ===== */}
            <div className="info-box">
              <h4>📝 Instrucciones</h4>
              <ul>
                <li>✓ Marca las afirmaciones con las que te sientas <strong>IDENTIFICADO(A)</strong> o que <strong>PRACTIQUES con cierta regularidad</strong>.</li>
                <li>✓ No necesitas ser un experto para marcar una opción. Si te gusta la actividad o crees que podrías desarrollarla, <strong>márcala</strong>.</li>
                <li>✓ Esto permite que tu perfil refleje tanto tus habilidades actuales como tus <strong>potenciales intereses</strong>.</li>
                <li>✓ Si no estás seguro(a), pregúntate: <em>"¿Me gustaría aprender más sobre esto?"</em> Si la respuesta es sí, <strong>márcala</strong>.</li>
                <li>✓ <strong>Importante:</strong> No importa cuántas marques. Tu perfil se ajustará a tus respuestas.</li>
              </ul>
            </div>

            <div className="form-section">
              <h4>📋 Datos Personales</h4>
              <div className="form-grid">
                <div className="input-group">
                  <label>Nombre Completo *</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={userInfo.nombre}
                    onChange={handleUserInfoChange}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="input-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={userInfo.email}
                    onChange={handleUserInfoChange}
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="input-group">
                  <label>Edad *</label>
                  <input 
                    type="number" 
                    name="edad"
                    value={userInfo.edad}
                    onChange={handleUserInfoChange}
                    placeholder="Tu edad"
                    min="5"
                    max="99"
                  />
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
        );

      case 1:
        const totalPreguntas = preguntasTest1.length;
        const respondidas = respuestas.filter(r => r).length;
        const progreso = Math.round((respondidas / totalPreguntas) * 100);

        return (
          <motion.div 
            className="step-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="progress-header">
              <div className="progress-info">
                <span>📊 Progreso: {respondidas}/{totalPreguntas}</span>
                <span className="progress-percentage">{progreso}%</span>
              </div>
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progreso}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="questions-grid">
              {preguntasTest1.map((pregunta, index) => (
                <motion.div 
                  key={index}
                  className={`question-item ${respuestas[index] ? 'selected' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleRespuesta(index)}
                >
                  <div className="question-number">{index + 1}</div>
                  <div className="question-text">{pregunta}</div>
                  <div className={`checkbox-custom ${respuestas[index] ? 'checked' : ''}`}>
                    {respuestas[index] && <FaCheckCircle />}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="navigation-buttons">
              <button 
                className="btn btn-outline"
                onClick={() => setCurrentStep(0)}
              >
                <FaArrowLeft /> Atrás
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleEnviarResultados}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : <>Ver Resultados <FaArrowRight /></>}
              </button>
            </div>
            <p className="info-text" style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
              💡 Puedes ver tus resultados sin importar cuántas preguntas hayas respondido. 
              El nivel de confianza se ajustará automáticamente.
            </p>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            className="step-container results-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="results-header">
              <h2 className="results-title">🎯 ¡Resultados Completos!</h2>
              <p className="results-subtitle">
                {userInfo.nombre}, aquí están tus resultados
              </p>
            </div>

            {/* ===== NIVEL DE CONFIANZA ===== */}
            {nivelConfianza && (
              <div style={{ 
                background: nivelConfianza.color + '20', 
                border: `2px solid ${nivelConfianza.color}`,
                borderRadius: '12px',
                padding: '15px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <span style={{ fontSize: '2rem' }}>
                  {nivelConfianza.nivel === 'Alta' ? '🟢' : nivelConfianza.nivel === 'Media' ? '🟡' : '🟠'}
                </span>
                <div>
                  <strong>Confiabilidad del perfil: {nivelConfianza.nivel}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#555' }}>
                    Has respondido {nivelConfianza.respondidas} de {nivelConfianza.total} preguntas ({nivelConfianza.porcentaje}%).
                    <br />
                    {nivelConfianza.mensaje}
                  </p>
                </div>
              </div>
            )}

            <div className="results-grid">
              {resultados.resultadosDetalle.map((item, index) => (
                <motion.div 
                  key={index}
                  className={`result-card ${index === resultados.indiceDominante ? 'dominant' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <h4>{item.tipo}</h4>
                  <div className="score">{item.puntaje}/8</div>
                  <div className="percentage">{item.porcentaje.toFixed(0)}%</div>
                  <div className="mini-bar">
                    <motion.div 
                      className="mini-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.porcentaje}%` }}
                      transition={{ duration: 1, delay: index * 0.08 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="dominant-card">
              <div className="dominant-icon">🏆</div>
              <h3>Inteligencia Dominante</h3>
              <h2 className="dominant-name">{resultados.inteligenciaDominante}</h2>
              <p>Puntaje: {resultados.maxPuntaje}/8 ({((resultados.maxPuntaje/8)*100).toFixed(0)}%)</p>
              <p className="dominant-desc">{descripcionesInteligencia[resultados.inteligenciaDominante]}</p>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={() => navigate('/')}>🏠 Inicio</button>
              <button className="btn btn-secondary" onClick={() => window.print()}>🖨️ Imprimir</button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="test1-container">
      <div className="container">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Test1Container;