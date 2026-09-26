import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './NotificationContext.css';

const NotificationContext = createContext();

let globalNotifyHandler = null;

export const notify = {
  success: (message, title = 'Login Successful') => {
    if (globalNotifyHandler) globalNotifyHandler({ type: 'success', title, message });
  },
  error: (message, title = 'Error') => {
    if (globalNotifyHandler) globalNotifyHandler({ type: 'error', title, message });
  },
  warning: (message, title = 'Warning') => {
    if (globalNotifyHandler) globalNotifyHandler({ type: 'warning', title, message });
  },
  info: (message, title = 'Information') => {
    if (globalNotifyHandler) globalNotifyHandler({ type: 'info', title, message });
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const hideNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showNotification = useCallback(({ type = 'success', title, message, duration = 3000 }) => {
    const id = Date.now() + Math.random();

    let displayTitle = title;
    if (!displayTitle) {
      const defaultTitles = {
        success: 'Login Successful',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
      };
      displayTitle = defaultTitles[type] || 'Notice';
    } else if (displayTitle === 'Login Success') {
      displayTitle = 'Login Successful';
    }

    const newNotification = {
      id,
      type,
      title: displayTitle,
      message: message || '',
      duration
    };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, duration);
  }, []);

  useEffect(() => {
    globalNotifyHandler = showNotification;
    return () => {
      globalNotifyHandler = null;
    };
  }, [showNotification]);

  const notifySuccess = (message, title = 'Login Successful') => showNotification({ type: 'success', title, message });
  const notifyError = (message, title = 'Error') => showNotification({ type: 'error', title, message });
  const notifyWarning = (message, title = 'Warning') => showNotification({ type: 'warning', title, message });
  const notifyInfo = (message, title = 'Information') => showNotification({ type: 'info', title, message });

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheck className="toast-icon toast-icon-success" id="popup-icon" data-testid="popup-icon" />;
      case 'error':
        return <FaTimesCircle className="toast-icon toast-icon-error" id="popup-icon" data-testid="popup-icon" />;
      case 'warning':
        return <FaExclamationTriangle className="toast-icon toast-icon-warning" id="popup-icon" data-testid="popup-icon" />;
      case 'info':
      default:
        return <FaInfoCircle className="toast-icon toast-icon-info" id="popup-icon" data-testid="popup-icon" />;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
        notify
      }}
    >
      {children}

      {/* Modern Top Notification Toast Container */}
      <div
        className="top-toast-container"
        id="top-notification-container"
        data-testid="top-notification-container"
      >
        <AnimatePresence>
          {notifications.map((item) => (
            <motion.div
              key={item.id}
              className={`top-toast-card toast-${item.type}`}
              id={item.type === 'error' ? 'login-error-popup' : item.type === 'success' ? 'login-success-popup' : 'centered-notification-popup'}
              data-testid={item.type === 'error' ? 'login-error-popup' : item.type === 'success' ? 'login-success-popup' : 'centered-notification-popup'}
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`toast-icon-circle circle-${item.type}`}>
                {getIcon(item.type)}
              </div>

              <div className="toast-body">
                <div className="toast-title" id="popup-title" data-testid="popup-title">
                  {item.title}
                </div>
                <div className="toast-message" id="popup-message" data-testid="popup-message">
                  {item.message}
                </div>
              </div>

              <button
                type="button"
                className="toast-close-btn"
                id="popup-close-button"
                data-testid="popup-close-button"
                aria-label="Close notification"
                onClick={() => hideNotification(item.id)}
              >
                <FaTimes />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
