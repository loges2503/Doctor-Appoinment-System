import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import './NotificationContext.css';

const NotificationContext = createContext();

// Global listener ref for non-hook callers if any
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
  info: (message, title = 'Notification') => {
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
      info: 'Notification'
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
  const notifyInfo = (message, title = 'Notice') => showNotification({ type: 'info', title, message });

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notify-icon notify-icon-success" />;
      case 'error':
        return <FaTimesCircle className="notify-icon notify-icon-error" />;
      case 'warning':
        return <FaExclamationTriangle className="notify-icon notify-icon-warning" />;
      case 'info':
      default:
        return <FaInfoCircle className="notify-icon notify-icon-info" />;
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

      {/* Dead Centered Global Notification Modal */}
      <AnimatePresence>
        {notification && (
          <div className="centered-notification-overlay" onClick={hideNotification}>
            <motion.div
              className={`centered-notification-card notify-card-${notification.type}`}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className={`notify-icon-wrapper wrapper-${notification.type}`}>
                {getIcon(notification.type)}
              </div>

              <h3 className="notify-modal-title">{notification.title}</h3>
              <p className="notify-modal-message">{notification.message}</p>

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
