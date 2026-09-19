import React from 'react';
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

        <div className="navbar-brand">
          <div className="brand-logo">
            <FaClinicMedical className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">MediCare</span>
            <span className="brand-subtitle">Reception Hub</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <div className="notifications-badge" title="Notifications">
          <FaBell className="bell-icon" />
          <span className="notification-dot"></span>
        </div>

        <div className="admin-profile-pill">
          <img
            src={
              admin?.avatar ||
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
            }
            alt={admin?.name || "Admin"}
            className="admin-avatar"
          />
          <div className="admin-info">
            <span className="admin-name">{admin?.name || "Receptionist"}</span>
            <span className="admin-role">
              <FaUserShield className="role-icon" /> {admin?.role || "Admin"}
            </span>
          </div>
        </div>

        <button className="btn-logout" onClick={logout} title="Sign Out">
          <FaSignOutAlt />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};
