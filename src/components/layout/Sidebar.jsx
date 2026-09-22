import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChartLine,
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaUserCog,
  FaShieldAlt,
  FaTimes,
  FaBell,
  FaBug
} from 'react-icons/fa';
import './Sidebar.css';

export const Sidebar = ({ isOpen, onCloseMobile }) => {
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <FaChartLine />,
      id: 'nav-dashboard'
    },
    {
      path: '/doctors',
      label: 'Doctors',
      icon: <FaUserMd />,
      id: 'nav-doctors'
    },
    {
      path: '/patients',
      label: 'Patients',
      icon: <FaUserInjured />,
      id: 'nav-patients'
    },
    {
      path: '/appointments',
      label: 'Appointments',
      icon: <FaCalendarCheck />,
      id: 'nav-appointments'
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: <FaBell />,
      id: 'nav-notifications'
    },
    {
      path: '/defects',
      label: 'Defect Log',
      icon: <FaBug />,
      id: 'nav-defects'
    },
    {
      path: '/profile',
      label: 'Admin Profile',
      icon: <FaUserCog />,
      id: 'nav-profile'
    }
  ];

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div className="sidebar-backdrop" id="sidebar-backdrop" data-testid="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`} id="main-sidebar" data-testid="main-sidebar">
        <div className="sidebar-mobile-header">
          <div className="sidebar-mobile-title">
            <FaShieldAlt className="mobile-shield-icon" /> Navigation
          </div>
          <button
            className="sidebar-close-btn"
            id="sidebar-close-btn"
            data-testid="sidebar-close-btn"
            aria-label="Close Mobile Sidebar"
            onClick={onCloseMobile}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav" id="sidebar-nav" data-testid="sidebar-nav">
          <div className="sidebar-section-label">MAIN MENU</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              id={item.id}
              data-testid={item.id}
              aria-label={`Navigate to ${item.label}`}
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
          <div className="system-status-card" id="system-status-card" data-testid="system-status-card">
            <div className="status-indicator">
              <span className="pulse-dot"></span> System Active
            </div>
            <p className="status-desc">LocalStorage synchronized.</p>
          </div>
        </div>
      </aside>
    </>
  );
};
