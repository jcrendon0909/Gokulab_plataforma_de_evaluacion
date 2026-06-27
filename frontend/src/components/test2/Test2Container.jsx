import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaRocket, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { atributosEmprendedores, interpretacionesEmprendedor } from '../../utils/constants';
import api from '../../services/api';
import './Test2Container.css';

const Test2Container = ({ setUserData, userData }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    nombre: userData?.nombre || '',
    email: userData?.email || '',
    edad: ''
  });
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleRespuesta = (id, valor) => {
    setRespuestas({ ...respuestas, [id]: parseInt(valor) });
  };

  const calcularResultados = () => {
    const total = Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    
    let categoria = 'inicial';
    if (total >= 41) categoria = 'excelente';
    else if (total >= 31) categoria = 'bueno';
    else if (total >= 21) categoria = 'potencial';
    
    const interpretacion = interpretacionesEmprendedor[categoria];
    
    return {
      total,
      categoria,
      interpretacion,
      detalle: atributosEmprendedores.map(attr => ({
        ...attr,
        puntaje: respuestas[attr.id] || 0
      }))
    };
  };

  const handleEnviarResultados = async () => {
    if (!userInfo.nombre || !userInfo.email || !userInfo.edad) {
      toast.error('Por favor completa todos tus datos');
      return;
    }

    if (Object.keys(respuestas).length < 10) {
      toast.error('Responde todos los 10 atributos');
      return;
    }

    setIsLoading(true);
    const resultadosCalculados = calcularResultados();

    try {
      const data = {
        nombre: userInfo.nombre.trim(),
        email: userInfo.email.trim(),
        edad: parseInt(userInfo.edad),
        tipoTest: 'emprendedor',
        resultados: {
          total: resultadosCalculados.total,
          categoria: resultadosCalculados.categoria,
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
        setStep(2);
        toast.success('¡Resultados guardados exitosamente!');
      }
    } catch (error) {
      toast.error('Error al guardar los resultados');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 0) {
    return (
      <div className="test2-container">
        <div className="container">
          <motion.div 
            className="step-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="step-header">
              <div className="step-icon"><FaRocket /></div>
              <h2 className="step-title">🚀 Test de Actitud Emprendedora</h2>
            </div>
            
            <p className="step-description">
              Evalúa tu perfil emprendedor y descubre tu potencial para liderar proyectos y negocios.
            </p>
            
            <div className="info-box">
              <h4>📝 Instrucciones</h4>
              <ul>
                <li>✓ Evalúa cada atributo del 1 al 5</li>
                <li>✓ 1 = Muy bajo | 5 = Muy alto</li>
                <li>✓ Sé honesto(a) para obtener resultados precisos</li>
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
              className="btn btn-secondary btn-block"
              onClick={() => setStep(1)}
              disabled={!userInfo.nombre || !userInfo.email || !userInfo.edad}
            >
              Comenzar Test <FaArrowRight />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    const total = Object.keys(respuestas).length;
    const progreso = Math.round((total / 10) * 100);

    return (
      <div className="test2-container">
        <div className="container">
          <motion.div 
            className="step-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="progress-header">
              <div className="progress-info">
                <span>📊 Progreso: {total}/10</span>
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

            <div className="atributos-grid">
              {atributosEmprendedores.map((attr) => (
                <motion.div 
                  key={attr.id}
                  className="atributo-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: attr.id * 0.05 }}
                >
                  <div className="atributo-header">
                    <span className="atributo-icon">{attr.icono}</span>
                    <div>
                      <h4>{attr.nombre}</h4>
                      <p className="atributo-desc">{attr.descripcion}</p>
                    </div>
                  </div>
                  <div className="atributo-escala">
                    {[1, 2, 3, 4, 5].map(val => (
                      <label key={val} className="escala-option">
                        <input
                          type="radio"
                          name={`attr-${attr.id}`}
                          value={val}
                          checked={respuestas[attr.id] === val}
                          onChange={() => handleRespuesta(attr.id, val)}
                        />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="navigation-buttons">
              <button className="btn btn-outline" onClick={() => setStep(0)}>
                <FaArrowLeft /> Atrás
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleEnviarResultados}
                disabled={total < 10 || isLoading}
              >
                {isLoading ? 'Guardando...' : <>Ver Resultados <FaArrowRight /></>}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Resultados
  return (
    <div className="test2-container">
      <div className="container">
        <motion.div 
          className="step-container results-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="results-header">
            <h2 className="results-title">🚀 ¡Resultados Completos!</h2>
            <p className="results-subtitle">{userInfo.nombre}, aquí está tu perfil emprendedor</p>
          </div>

          <div className="puntaje-total">
            <div className="puntaje-numero">{resultados.total}/50</div>
            <div className="puntaje-categoria">{resultados.interpretacion.titulo}</div>
          </div>

          <div className="interpretacion-box">
            <p className="interpretacion-desc">{resultados.interpretacion.descripcion}</p>
            <div className="recomendaciones">
              <h4>🎯 Recomendaciones:</h4>
              <ul>
                {resultados.interpretacion.recomendaciones.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="detalle-atributos">
            <h4>📊 Desglose por Atributo</h4>
            <div className="atributos-detalle">
              {resultados.detalle.map((attr) => (
                <div key={attr.id} className="atributo-detalle-item">
                  <span className="detalle-icon">{attr.icono}</span>
                  <span className="detalle-nombre">{attr.nombre}</span>
                  <div className="detalle-barra">
                    <motion.div 
                      className="detalle-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(attr.puntaje / 5) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="detalle-puntaje">{attr.puntaje}/5</span>
                </div>
              ))}
            </div>
          </div>

          <div className="result-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/')}>🏠 Inicio</button>
            <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Imprimir</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Test2Container;