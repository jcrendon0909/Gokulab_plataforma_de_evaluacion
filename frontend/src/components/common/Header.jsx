import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import './Header.css';

const Header = ({ userData }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/test/inteligencias', label: 'Inteligencias', icon: '🧠' },
    { path: '/test/emprendedor', label: 'Emprendedor', icon: '🚀' },
    { path: '/admin', label: 'Administrar', icon: '📊' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo-container">
            <div className="logo-icon">
              <GiBrain size={32} color="white" />
            </div>
            <div className="logo-text">
              <span className="brand">GŌKU LAB</span>
              <div className="slogan">
                <span className="slogan-juega">Juega</span>
                <span className="slogan-aprende">Aprende</span>
                <span className="slogan-emprende">Emprende</span>
              </div>
            </div>
          </Link>

          <nav className="nav-desktop">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="navIndicator"
                    transition={{ type: 'spring', duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
            {userData && (
              <div className="user-badge">
                <FaUser />
                <span>{userData.nombre}</span>
              </div>
            )}
          </nav>

          <button 
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className={`nav-mobile ${mobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link-mobile ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;