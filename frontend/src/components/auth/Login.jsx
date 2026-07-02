import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar credenciales contra el backend
      // Usamos una petición a /api/resultados/listar con autenticación básica
      const response = await api.verificarCredenciales(username, password);
      
      if (response.success) {
        login(username, password);
        toast.success('✅ Inicio de sesión exitoso');
        navigate('/admin');
      } else {
        toast.error('❌ Usuario o contraseña incorrectos');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('❌ Usuario o contraseña incorrectos');
      } else {
        toast.error('❌ Error al conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔐 Acceso Administrativo</h2>
        <p>Ingresa tus credenciales para acceder al panel de administración</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;