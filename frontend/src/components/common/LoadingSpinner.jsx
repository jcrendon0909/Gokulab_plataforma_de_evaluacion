import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <div className="spinner-container">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="spinner-circle" />
      </motion.div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;