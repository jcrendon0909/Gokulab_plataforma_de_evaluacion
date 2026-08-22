import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/test/inteligencias', label: 'Inteligencias', icon: '🧠' },
    { path: '/test/emprendedor', label: 'Emprendedor', icon: '🚀' },
    { path: '/test/liderazgo', label: 'Liderazgo', icon: '👥' }, // ← NUEVO
    { path: '/admin', label: 'Administrar', icon: '📊' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Sesión cerrada');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
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

          {/* Desktop Navigation */}
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

            {/* Sección de autenticación */}
            {isAuthenticated ? (
              <div className="user-section">
                <div className="user-badge">
                  <FaUser />
                  <span>{user?.username || 'Admin'}</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-link">
                <FaUser /> Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
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
          {/* Mobile auth */}
          {isAuthenticated ? (
            <div className="user-mobile">
              <div className="user-badge-mobile">
                <FaUser />
                <span>{user?.username || 'Admin'}</span>
              </div>
              <button className="btn-logout-mobile" onClick={handleLogout}>
                <FaSignOutAlt /> Cerrar sesión
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link-mobile">
              <FaUser /> Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;