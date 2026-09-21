import React, { createContext, useContext, useState, useEffect } from 'react';
import { notify } from './NotificationContext';
import {
  initializeLocalStorage,
  authenticateAdmin,
  registerAdmin,
  updateAdminProfile,
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
      // Trigger centered notification for successful login
      notify.success('Welcome back! You have logged in successfully.', 'Login Successful');
      return true;
    } else {
      notify.error(res.message || 'Invalid username or password.', 'Login Failed');
      return false;
    }
  };

  const register = (formData) => {
    try {
      const newAdmin = registerAdmin(formData);
      notify.success('Registration successful! You can now log in.', 'Account Created');
      return { success: true, admin: newAdmin };
    } catch (err) {
      notify.error(err.message || 'Registration failed.', 'Registration Error');
      return { success: false, message: err.message };
    }
  };

  const updateProfile = (updatedFields) => {
    if (!admin) return false;
    try {
      const updatedAdmin = updateAdminProfile(admin.id, updatedFields);
      setAdmin((prev) => ({
        ...prev,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        clinicName: updatedAdmin.clinicName,
        address: updatedAdmin.address,
        avatar: updatedAdmin.avatar
      }));
      notify.success('Admin profile updated successfully!', 'Profile Updated');
      return true;
    } catch (err) {
      notify.error(err.message || 'Failed to update profile.', 'Update Error');
      return false;
    }
  };

  const logout = () => {
    clearAdminSession();
    setAdmin(null);
    notify.info('Logged out successfully.', 'Signed Out');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!admin,
        loading
      }}
    >
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
