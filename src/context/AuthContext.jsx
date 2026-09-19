import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  initializeLocalStorage,
  authenticateAdmin,
  getActiveAdminSession,
  clearAdminSession
} from '../services/localStorageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed sample data if local storage is empty
    initializeLocalStorage();

    // Check active session
    const session = getActiveAdminSession();
    if (session) {
      setAdmin(session);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const res = authenticateAdmin(username, password);
    if (res.success) {
      setAdmin(res.user);
      toast.success('Login Successful! Welcome back.', {
        style: {
          borderRadius: '12px',
          background: '#1F2937',
          color: '#fff',
          fontWeight: 600
        }
      });
      return true;
    } else {
      toast.error(res.message || 'Login Failed. Invalid credentials.', {
        style: {
          borderRadius: '12px',
          background: '#EF4444',
          color: '#fff',
          fontWeight: 600
        }
      });
      return false;
    }
  };

  const logout = () => {
    clearAdminSession();
    setAdmin(null);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
