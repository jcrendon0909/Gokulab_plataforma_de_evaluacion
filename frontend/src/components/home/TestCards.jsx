import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaRocket, FaClock, FaChartBar, FaUsers } from 'react-icons/fa';
import './TestCards.css';

const TestCards = () => {
  const navigate = useNavigate();

  const tests = [
    {
      id: 'inteligencias',
      title: 'Inteligencias Múltiples',
      icon: <FaBrain />,
      description: 'Descubre tus habilidades predominantes según la teoría de Howard Gardner. Identifica tus fortalezas en 7 áreas diferentes.',
      features: ['56 preguntas', '7 tipos de inteligencia', 'Resultados detallados'],
      color: 'primary',
      path: '/test/inteligencias', // ← NUEVO
      time: '10-15 min'
    },
    {
      id: 'emprendedor',
      title: 'Actitud Emprendedora',
      icon: <FaRocket />,
      description: 'Evalúa tu perfil emprendedor y descubre tu potencial para liderar proyectos y negocios con éxito.',
      features: ['10 atributos', 'Evaluación 1-5', 'Recomendaciones personalizadas'],
      color: 'secondary',
      path: '/test/emprendedor',
      time: '5-8 min'
    },
    // ===== NUEVO TEST DE LIDERAZGO =====
    {
      id: 'liderazgo',
      title: 'Liderazgo Integral',
      icon: <FaUsers />,
      description: 'Descubre tu perfil de liderazgo en 7 dimensiones clave: estratégica, transformacional, operativa, social, adaptativa, ética y desarrollo de personas.',
      features: ['42 preguntas', '7 dimensiones', 'Perfil detallado'],
      color: 'primary',
      path: '/test/liderazgo',
      time: '15-20 min'
    }
  ];

  return (
    <section className="test-cards-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Elige tu <span className="text-gradient">Evaluación</span></h2>
          <p className="section-subtitle">Selecciona el test que mejor se adapte a tus necesidades y comienza tu viaje de autoconocimiento</p>
        </motion.div>

        <div className="cards-grid">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              className={`test-card ${test.color}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="card-icon">{test.icon}</div>
              <h3 className="card-title">{test.title}</h3>
              <p className="card-description">{test.description}</p>

              <div className="card-features">
                {test.features.map((feature, i) => (
                  <span key={i} className="feature-tag">
                    <span className="feature-dot">•</span> {feature}
                  </span>
                ))}
              </div>

              <div className="card-footer">
                <div className="card-time">
                  <FaClock />
                  <span>{test.time}</span>
                </div>
                <button
                  className={`btn btn-${test.color}`}
                  onClick={() => navigate(test.path)}
                >
                  Comenzar Test <FaChartBar />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestCards; 
