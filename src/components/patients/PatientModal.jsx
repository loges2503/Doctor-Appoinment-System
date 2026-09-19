import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { validatePatientForm } from '../../utils/validation';
import toast from 'react-hot-toast';

export const PatientModal = ({ isOpen, onClose, onSave, patient = null }) => {
  const isEdit = !!patient;

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        age: patient.age !== undefined ? String(patient.age) : '',
        gender: patient.gender || 'Male',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || ''
      });
    } else {
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: ''
      });
    }
    setErrors({});
  }, [patient, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validatePatientForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Please fix validation errors before submitting.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Patient Record' : 'Register New Patient'}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name * (Min 3 characters)</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Robert Miller"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Age * (1-120)</label>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              placeholder="e.g. 45"
              className={`form-input ${errors.age ? 'error' : ''}`}
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Gender *</label>
            <select
              name="gender"
              className={`form-select ${errors.gender ? 'error' : ''}`}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="error-text">{errors.gender}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number * (10 Digits)</label>
          <input
            type="text"
            name="phone"
            maxLength="10"
            placeholder="e.g. 9876543210"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Email Address (Optional)</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. patient@example.com"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Residential Address (Optional)</label>
          <textarea
            name="address"
            rows="2"
            placeholder="e.g. Street name, City"
            className="form-textarea"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Save Changes' : 'Register Patient'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
