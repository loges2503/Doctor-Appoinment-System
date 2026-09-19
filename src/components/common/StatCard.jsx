import React from 'react';
import { motion } from 'framer-motion';
import './StatCard.css';

export const StatCard = ({ title, value, icon, badgeText, badgeColor = 'blue', accentColor = '#3B82F6' }) => {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -3, boxShadow: '0 12px 20px -4px rgba(0, 0, 0, 0.08)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="stat-card-header">
        <div className="stat-icon-wrapper" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
          {icon}
        </div>
        {badgeText && (
          <span className={`stat-badge stat-badge-${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="stat-card-body">
        <h4 className="stat-title">{title}</h4>
        <div className="stat-value">{value}</div>
      </div>
    </motion.div>
  );
};
