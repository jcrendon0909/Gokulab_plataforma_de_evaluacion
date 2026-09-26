import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Sesión cerrada');
    setMobileMenuOpen(false);
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

          {/* Solo Auth (Desktop) */}
          <nav className="nav-desktop">
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
            <Link to="/login" className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>
              <FaUser /> Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;