import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './NotificationContext.css';

const NotificationContext = createContext();

let globalNotifyHandler = null;

export const notify = {
  success: (message, title = 'Success') => {
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
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);

  const hideNotification = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setNotification(null);
  }, []);

  const showNotification = useCallback(({ type = 'success', title, message, duration = 2500 }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const defaultTitles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };

    setNotification({
      type,
      title: title || defaultTitles[type] || 'Notice',
      message: message || '',
      duration
    });

    timerRef.current = setTimeout(() => {
      setNotification(null);
      timerRef.current = null;
    }, duration);
  }, []);

  useEffect(() => {
    globalNotifyHandler = showNotification;
    return () => {
      globalNotifyHandler = null;
    };
  }, [showNotification]);

  const notifySuccess = (message, title = 'Success') => showNotification({ type: 'success', title, message });
  const notifyError = (message, title = 'Error') => showNotification({ type: 'error', title, message });
  const notifyWarning = (message, title = 'Warning') => showNotification({ type: 'warning', title, message });
  const notifyInfo = (message, title = 'Information') => showNotification({ type: 'info', title, message });

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notify-icon notify-icon-success" id="popup-icon" data-testid="popup-icon" />;
      case 'error':
        return <FaTimesCircle className="notify-icon notify-icon-error" id="popup-icon" data-testid="popup-icon" />;
      case 'warning':
        return <FaExclamationTriangle className="notify-icon notify-icon-warning" id="popup-icon" data-testid="popup-icon" />;
      case 'info':
      default:
        return <FaInfoCircle className="notify-icon notify-icon-info" id="popup-icon" data-testid="popup-icon" />;
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

      {/* Dead Centered Reusable Notification Popup Modal */}
      <AnimatePresence>
        {notification && (
          <div
            className="centered-notification-overlay"
            id={notification.type === 'error' ? 'login-error-popup' : notification.type === 'success' ? 'login-success-popup' : 'centered-notification-overlay'}
            data-testid="centered-notification-overlay"
            onClick={hideNotification}
          >
            <motion.div
              className={`centered-notification-card notify-card-${notification.type}`}
              id="centered-notification-popup"
              data-testid="centered-notification-popup"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <button
                type="button"
                className="notify-close-btn"
                id="popup-close-button"
                data-testid="popup-close-button"
                aria-label="Close notification"
                onClick={hideNotification}
              >
                <FaTimes />
              </button>

              <div className={`notify-icon-wrapper wrapper-${notification.type}`}>
                {getIcon(notification.type)}
              </div>

              <h3 className="notify-modal-title" id="popup-title" data-testid="popup-title">
                {notification.title}
              </h3>
              <p className="notify-modal-message" id="popup-message" data-testid="popup-message">
                {notification.message}
              </p>

              <div className="notify-progress-track">
                <motion.div
                  className={`notify-progress-fill fill-${notification.type}`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: (notification.duration || 2500) / 1000, ease: 'linear' }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
