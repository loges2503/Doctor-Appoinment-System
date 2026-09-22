import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaClinicMedical,
  FaBars,
  FaSignOutAlt,
  FaUserShield,
  FaBell
} from 'react-icons/fa';
import './Navbar.css';

export const Navbar = ({ onToggleSidebar }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar" id="main-navbar" data-testid="main-navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          id="sidebar-toggle-btn"
          data-testid="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </button>

        <Link
          to="/dashboard"
          className="navbar-brand"
          id="navbar-brand-link"
          data-testid="navbar-brand-link"
          aria-label="Medicare Home Dashboard"
          style={{ textDecoration: 'none' }}
        >
          <div className="brand-logo" id="navbar-logo" data-testid="navbar-logo">
            <FaClinicMedical className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title" id="brand-title" data-testid="brand-title">MediCare</span>
            <span className="brand-subtitle" id="brand-subtitle" data-testid="brand-subtitle">Reception Hub</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Notification Bell Button */}
        <button
          className="notifications-badge-btn"
          id="notifications-bell-btn"
          data-testid="notifications-bell-btn"
          onClick={() => navigate('/notifications')}
          title="View Notifications"
          aria-label="View Notifications"
        >
          <FaBell className="bell-icon" />
          <span className="notification-dot" id="notification-dot" data-testid="notification-dot"></span>
        </button>

        {/* Admin Profile Link */}
        <Link
          to="/profile"
          className="admin-profile-pill"
          id="admin-profile-pill"
          data-testid="admin-profile-pill"
          aria-label="View Profile"
          style={{ textDecoration: 'none' }}
        >
          <img
            src={
              admin?.avatar ||
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
            }
            alt={admin?.name || admin?.fullName || "User"}
            className="admin-avatar"
            id="navbar-user-avatar"
            data-testid="navbar-user-avatar"
          />
          <div className="admin-info">
            <span className="admin-name" id="navbar-user-name" data-testid="navbar-user-name">
              {admin?.name || admin?.fullName || "Administrator"}
            </span>
            <span className="admin-role" id="navbar-user-role" data-testid="navbar-user-role">
              <FaUserShield className="role-icon" /> {admin?.designation || admin?.role || "Admin"}
            </span>
          </div>
        </Link>

        <button
          className="btn-logout"
          id="logout-button"
          data-testid="logout-button"
          aria-label="Logout Button"
          onClick={logout}
          title="Sign Out"
        >
          <FaSignOutAlt />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};
