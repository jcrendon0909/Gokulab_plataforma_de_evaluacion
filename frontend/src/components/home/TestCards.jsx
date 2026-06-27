import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaRocket, FaClock, FaChartBar } from 'react-icons/fa';
import './TestCards.css';

const TestCards = () => {
  const navigate = useNavigate();

  const tests = [
    {
      id: 'inteligencias',
      title: 'Inteligencias Múltiples',
      icon: <FaBrain />,
      description: 'Descubre tus habilidades predominantes según la teoría de Howard Gardner.',
      features: ['56 preguntas', '7 tipos', 'Resultados detallados'],
      color: 'primary',
      path: '/test/inteligencias',
      time: '10-15 min'
    },
    {
      id: 'emprendedor',
      title: 'Actitud Emprendedora',
      icon: <FaRocket />,
      description: 'Evalúa tu perfil emprendedor y descubre tu potencial para liderar proyectos.',
      features: ['10 atributos', 'Escala 1-5', 'Recomendaciones'],
      color: 'secondary',
      path: '/test/emprendedor',
      time: '5-8 min'
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
          <p className="section-subtitle">Selecciona el test que mejor se adapte a tus necesidades</p>
        </motion.div>

        <div className="cards-grid">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              className={`test-card ${test.color}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="card-icon">{test.icon}</div>
              <h3 className="card-title">{test.title}</h3>
              <p className="card-description">{test.description}</p>
              
              <div className="card-features">
                {test.features.map((feature, i) => (
                  <span key={i} className="feature-tag">• {feature}</span>
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
                  Comenzar <FaChartBar />
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