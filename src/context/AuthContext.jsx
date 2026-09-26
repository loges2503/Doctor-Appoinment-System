import React, { createContext, useContext, useState, useEffect } from 'react';
import { notify } from './NotificationContext';
import {
  initializeLocalStorage,
  authenticateAdmin,
  updateAdminProfile,
  getActiveAdminSession,
  clearAdminSession
} from '../services/localStorageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLocalStorage();
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
      notify.success('Welcome back', 'Login Successful');
      return { success: true, user: res.user };
    } else {
      notify.error(res.message || 'Invalid Username or Password.', 'Invalid Login');
      return { success: false, message: res.message };
    }
  };

  const updateProfile = (updatedFields) => {
    if (!admin) return false;
    try {
      const updatedUser = updateAdminProfile(admin.id, updatedFields);
      setAdmin((prev) => ({
        ...prev,
        fullName: updatedUser.fullName,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        clinicName: updatedUser.clinicName,
        address: updatedUser.address,
        avatar: updatedUser.avatar
      }));
      notify.success('Profile updated successfully!', 'Profile Updated');
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
        user: admin,
        login,
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
