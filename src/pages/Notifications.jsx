import React from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaInfoCircle } from 'react-icons/fa';
import './Notifications.css';

export const Notifications = () => {
  return (
    <div className="notifications-page" id="notifications-page" data-testid="notifications-page">
      <div className="page-header" id="notifications-header" data-testid="notifications-header">
        <div>
          <h1 className="page-title" id="notifications-title" data-testid="notifications-title">System Notifications</h1>
          <p className="page-subtitle" id="notifications-subtitle" data-testid="notifications-subtitle">Alerts, system updates, and receptionist notifications.</p>
        </div>
      </div>

      <motion.div
        className="card notifications-empty-card"
        id="notifications-empty-card"
        data-testid="notifications-empty-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bell-illustration-wrapper">
          <div className="bell-pulse-ring"></div>
          <FaBell className="bell-illustration-icon" />
        </div>

        <h2 className="notifications-empty-title">No Notifications Yet</h2>
        <p className="notifications-empty-subtitle">
          You don't have any notifications at the moment.
        </p>

        <div className="notification-future-info">
          <FaInfoCircle className="info-icon" />
          <span>New appointment requests, status changes, and receptionist updates will appear here automatically.</span>
        </div>
      </motion.div>
    </div>
  );
};
