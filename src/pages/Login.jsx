import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';
import {
  FaClinicMedical,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaUserShield,
  FaUserMd,
  FaClipboardList
} from 'react-icons/fa';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { notifyInfo } = useNotification();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    notifyInfo(
      'Predefined Automation Test Credentials:\n• Admin: admin / Admin@123\n• Doctor: doctor / Doctor@123\n• Receptionist: reception / Reception@123',
      'Automation Test Credentials'
    );
  };

  const handleFillCredentials = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username or Email is required.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const res = login(username, password);
    if (res.success) {
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page" id="login-page" data-testid="login-page">
      <div className="login-bg-pattern" />

      <motion.div
        className="login-card-container"
        id="login-card-container"
        data-testid="login-card-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="login-header" id="login-header" data-testid="login-header">
          <div className="login-brand-icon" id="medicare-logo" data-testid="medicare-logo">
            <FaClinicMedical />
          </div>
          <h2 className="login-title" id="login-title" data-testid="login-title">
            MediCare Demo Portal
          </h2>
          <p className="login-subtitle" id="login-welcome-message" data-testid="login-welcome-message">
            Automation Testing Practice & Demonstration Environment
          </p>
        </div>

        {/* Predefined Test Credentials Helper Card for Automation Testers */}
       

        <form onSubmit={handleSubmit} className="login-form" id="login-form" data-testid="login-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username-input">
              Username or Email *
            </label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="username-input"
                name="username"
                data-testid="username-input"
                aria-label="Username or Email"
                className={`form-input icon-padded ${errors.username ? 'error' : ''}`}
                placeholder="Enter username (admin, doctor, reception)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
                }}
                disabled={isSubmitting}
                required
              />
            </div>
            {errors.username && (
              <span className="error-text" id="username-error" data-testid="username-error">
                {errors.username}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password *
            </label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password-input"
                name="password"
                data-testid="password-input"
                aria-label="Password"
                className={`form-input icon-padded right-padded ${errors.password ? 'error' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                id="show-password-toggle"
                data-testid="show-password-toggle"
                aria-label={showPassword ? "Hide Password" : "Show Password"}
                onClick={toggleShowPassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="error-text" id="password-error" data-testid="password-error">
                {errors.password}
              </span>
            )}
          </div>

          <div className="login-options-row">
            <label className="remember-me-label" htmlFor="remember-checkbox">
              <input
                type="checkbox"
                id="remember-checkbox"
                name="remember"
                data-testid="remember-checkbox"
                aria-label="Remember Me Checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>

            <a
              href="#forgot-password"
              className="forgot-password-link"
              id="forgot-password-link"
              data-testid="forgot-password-link"
              aria-label="Forgot Password Link"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            id="login-button"
            data-testid="login-button"
            aria-label="Login Button"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {isSubmitting ? 'Signing In...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
