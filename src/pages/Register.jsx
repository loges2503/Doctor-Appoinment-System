import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FaClinicMedical,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaShieldAlt,
  FaUserPlus
} from 'react-icons/fa';
import './Register.css';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. All required field validations
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    
    // 2. Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 3. Phone number validation (exact 10 digits)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must contain exactly 10 digits.';
    }

    // 4. Username validation
    if (!formData.username.trim()) newErrors.username = 'Username is required.';

    // 5. Password validation (min 8 chars)
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    // 6. Confirm Password match validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit to register method (which checks duplicate email, phone, and username)
    const res = register(formData);
    if (!res.success) {
      const errMsg = res.message || '';
      if (errMsg.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: errMsg }));
      } else if (errMsg.toLowerCase().includes('phone')) {
        setErrors((prev) => ({ ...prev, phone: errMsg }));
      } else if (errMsg.toLowerCase().includes('username')) {
        setErrors((prev) => ({ ...prev, username: errMsg }));
      } else {
        setErrors((prev) => ({ ...prev, general: errMsg }));
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="register-page">
      <div className="register-bg-pattern" />

      <motion.div
        className="register-card-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="register-header">
          <div className="register-brand-icon">
            <FaClinicMedical />
          </div>
          <h2 className="register-title">Register Administrator</h2>
          <p className="register-subtitle">Create a new clinic receptionist/admin account</p>
        </div>

        {errors.general && (
          <div className="form-general-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                className={`form-input icon-padded ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Dr. John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className={`form-input icon-padded ${errors.email ? 'error' : ''}`}
                  placeholder="admin@clinic.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number * (10 Digits)</label>
              <div className="input-with-icon">
                <FaPhoneAlt className="input-icon" />
                <input
                  type="text"
                  name="phone"
                  maxLength="10"
                  className={`form-input icon-padded ${errors.phone ? 'error' : ''}`}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Username * (Must be unique)</label>
            <div className="input-with-icon">
              <FaShieldAlt className="input-icon" />
              <input
                type="text"
                name="username"
                className={`form-input icon-padded ${errors.username ? 'error' : ''}`}
                placeholder="Choose username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Password * (Min 8 chars)</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  className={`form-input icon-padded ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-input icon-padded ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
            <FaUserPlus /> Register Admin Account
          </button>
        </form>

        <div className="register-footer-link">
          Already have an administrator account? <Link to="/login">Sign In Here</Link>
        </div>
      </motion.div>
    </div>
  );
};
