import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChartLine,
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaShieldAlt,
  FaTimes
} from 'react-icons/fa';
import './Sidebar.css';

export const Sidebar = ({ isOpen, onCloseMobile }) => {
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <FaChartLine />
    },
    {
      path: '/doctors',
      label: 'Doctors',
      icon: <FaUserMd />
    },
    {
      path: '/patients',
      label: 'Patients',
      icon: <FaUserInjured />
    },
    {
      path: '/appointments',
      label: 'Appointments',
      icon: <FaCalendarCheck />
    }
  ];

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-mobile-header">
          <div className="sidebar-mobile-title">
            <FaShieldAlt className="mobile-shield-icon" /> Navigation
          </div>
          <button className="sidebar-close-btn" onClick={onCloseMobile}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">MAIN MENU</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onCloseMobile}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status-card">
            <div className="status-indicator">
              <span className="pulse-dot"></span> System Ready
            </div>
            <p className="status-desc">LocalStorage active & synchronized.</p>
          </div>
        </div>
      </aside>
    </>
  );
};
