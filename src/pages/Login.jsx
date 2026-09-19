import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaClinicMedical, FaLock, FaUser, FaUserPlus } from 'react-icons/fa';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    
    if (login(username, password)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern" />

      <motion.div
        className="login-card-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="login-header">
          <div className="login-brand-icon">
            <FaClinicMedical />
          </div>
          <h2 className="login-title">MediCare Reception Portal</h2>
          <p className="login-subtitle">Admin & Receptionist Portal Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                className="form-input icon-padded"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                className="form-input icon-padded"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In to Dashboard
          </button>
        </form>

        <div className="login-register-prompt">
          <span>Need a new administrator account?</span>
          <Link to="/register" className="register-link">
            <FaUserPlus /> Register Admin
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
