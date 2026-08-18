import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total, label }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="progress-wrapper">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="progress-stats">
        <span>{current} de {total}</span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;