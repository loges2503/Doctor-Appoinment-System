import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminProfile } from '../services/localStorageService';
import { Modal } from '../components/common/Modal';
import { motion } from 'framer-motion';
import {
  FaUserShield,
  FaEnvelope,
  FaPhoneAlt,
  FaHospital,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaEdit,
  FaLock
} from 'react-icons/fa';
import { notify } from '../context/NotificationContext';
import './Profile.css';

export const Profile = () => {
  const { admin, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    clinicName: '',
    address: '',
    avatar: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const loadProfile = () => {
    if (admin) {
      const p = getAdminProfile(admin.id);
      setProfileData(p || admin);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [admin]);

  const handleOpenEdit = () => {
    if (!profileData) return;
    setEditForm({
      name: profileData.name || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      clinicName: profileData.clinicName || 'MediCare Clinic & Hospital',
      address: profileData.address || '',
      avatar: profileData.avatar || ''
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errors = {};

    if (!editForm.name.trim()) errors.name = 'Full name is required.';
    
    if (!editForm.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!editForm.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(editForm.phone.trim())) {
      errors.phone = 'Phone number must contain exactly 10 digits.';
    }

    if (!editForm.clinicName.trim()) {
      errors.clinicName = 'Clinic/Hospital name is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      notify.error('Please fix validation errors in the form.', 'Validation Error');
      return;
    }

    const success = updateProfile(editForm);
    if (success) {
      setIsEditModalOpen(false);
      loadProfile();
    }
  };

  if (!profileData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
        Loading Admin Profile...
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Administrator Profile</h1>
          <p className="page-subtitle">View and update administrator credentials, clinic details, and contact information.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenEdit}>
          <FaEdit /> Edit Profile
        </button>
      </div>

      <div className="profile-content-grid">
        {/* Profile Card Header */}
        <motion.div
          className="card profile-main-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="profile-avatar-wrapper">
            <img
              src={
                profileData.avatar ||
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
              }
              alt={profileData.name}
              className="profile-avatar-img"
            />
            <span className="profile-active-badge" title="Active Admin"></span>
          </div>

          <div className="profile-identity">
            <h2 className="profile-name">{profileData.name}</h2>
            <div className="profile-designation">
              <FaUserShield className="designation-icon" />
              {profileData.designation || profileData.role || "Chief Administrator"}
            </div>

            <div className="profile-id-badge">
              <FaIdCard className="id-icon" /> Admin ID: <strong>{profileData.id || "ADM1001"}</strong>
            </div>
          </div>
        </motion.div>

        {/* Profile Details List */}
        <motion.div
          className="card profile-details-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="section-title">Account & Contact Details</h3>

          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">
                <FaIdCard className="item-icon" /> Admin ID
              </div>
              <div className="detail-value highlight-id">
                {profileData.id || "ADM1001"}{' '}
                <span className="locked-tag">
                  <FaLock className="lock-icon" /> Read-Only
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <FaEnvelope className="item-icon" /> Email Address
              </div>
              <div className="detail-value">{profileData.email || "admin@medicare.com"}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <FaPhoneAlt className="item-icon" /> Phone Number
              </div>
              <div className="detail-value">{profileData.phone || "9876543210"}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <FaHospital className="item-icon" /> Clinic / Hospital Name
              </div>
              <div className="detail-value">{profileData.clinicName || "MediCare Clinic & Hospital"}</div>
            </div>

            <div className="detail-item" style={{ gridColumn: 'span 2' }}>
              <div className="detail-label">
                <FaMapMarkerAlt className="item-icon" /> Office Address
              </div>
              <div className="detail-value">
                {profileData.address || "742 Healthcare Boulevard, Suite 100"}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <FaCalendarAlt className="item-icon" /> Date Joined
              </div>
              <div className="detail-value">{profileData.dateJoined || "2024-01-15"}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Admin Profile"
        maxWidth="560px"
      >
        <form onSubmit={handleSaveProfile}>
          {/* Admin ID Read-Only Banner */}
          <div className="admin-id-locked-banner">
            <FaLock /> Admin ID: <strong>{profileData.id}</strong> (System Protected & Non-Editable)
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className={`form-input ${formErrors.name ? 'error' : ''}`}
              value={editForm.name}
              onChange={handleFormChange}
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                value={editForm.email}
                onChange={handleFormChange}
              />
              {formErrors.email && <span className="error-text">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number * (10 Digits)</label>
              <input
                type="text"
                name="phone"
                maxLength="10"
                className={`form-input ${formErrors.phone ? 'error' : ''}`}
                value={editForm.phone}
                onChange={handleFormChange}
              />
              {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clinic / Hospital Name *</label>
            <input
              type="text"
              name="clinicName"
              className={`form-input ${formErrors.clinicName ? 'error' : ''}`}
              value={editForm.clinicName}
              onChange={handleFormChange}
            />
            {formErrors.clinicName && <span className="error-text">{formErrors.clinicName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Profile Avatar Image URL</label>
            <input
              type="url"
              name="avatar"
              placeholder="https://images.unsplash.com/..."
              className="form-input"
              value={editForm.avatar}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Office Address</label>
            <textarea
              name="address"
              rows="2"
              className="form-textarea"
              value={editForm.address}
              onChange={handleFormChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Profile Details
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
