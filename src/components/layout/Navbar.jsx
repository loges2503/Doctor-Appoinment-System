import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaClinicMedical,
  FaBars,
  FaSignOutAlt,
  FaUserShield,
  FaBell,
  FaUser
} from 'react-icons/fa';
import './Navbar.css';

export const Navbar = ({ onToggleSidebar }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </button>

        <Link to="/dashboard" className="navbar-brand" style={{ textDecoration: 'none' }}>
          <div className="brand-logo">
            <FaClinicMedical className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">MediCare</span>
            <span className="brand-subtitle">Reception Hub</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Notification Bell Button */}
        <button
          className="notifications-badge-btn"
          onClick={() => navigate('/notifications')}
          title="View Notifications"
          aria-label="View Notifications"
        >
          <FaBell className="bell-icon" />
          <span className="notification-dot"></span>
        </button>

        {/* Admin Profile Link */}
        <Link to="/profile" className="admin-profile-pill" style={{ textDecoration: 'none' }}>
          <img
            src={
              admin?.avatar ||
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
            }
            alt={admin?.name || "Admin"}
            className="admin-avatar"
          />
          <div className="admin-info">
            <span className="admin-name">{admin?.name || "Administrator"}</span>
            <span className="admin-role">
              <FaUserShield className="role-icon" /> {admin?.designation || admin?.role || "Admin"}
            </span>
          </div>
        </Link>

        <button className="btn-logout" onClick={logout} title="Sign Out">
          <FaSignOutAlt />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};
