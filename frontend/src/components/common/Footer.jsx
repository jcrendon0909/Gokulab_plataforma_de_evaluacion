import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>GŌKU LAB</h3>
            <p>Juega, Aprende y Emprende</p>
          </div>
          <div className="footer-links">
            <a href="/">Inicio</a>
            <a href="/test/inteligencias">Inteligencias</a>
            <a href="/test/emprendedor">Emprendedor</a>
            <a href="/admin">Administrar</a>
          </div>
          <div className="footer-copy">
            <p>© {currentYear} GŌKU LAB. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;