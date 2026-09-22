import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { validatePatientForm } from '../../utils/validation';
import { notify } from '../../context/NotificationContext';

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
      notify.error('Please fix validation errors before submitting.', 'Validation Error');
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
      <form onSubmit={handleSubmit} id="patient-form" data-testid="patient-form" noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="patient-name-input">Full Name * (Min 3 characters)</label>
          <input
            type="text"
            id="patient-name-input"
            name="name"
            data-testid="patient-name-input"
            aria-label="Patient Full Name"
            placeholder="e.g. Robert Miller"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="error-text" id="patient-name-error" data-testid="patient-name-error">{errors.name}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="patient-age-input">Age * (1-120)</label>
            <input
              type="number"
              id="patient-age-input"
              name="age"
              data-testid="patient-age-input"
              aria-label="Patient Age"
              min="1"
              max="120"
              placeholder="e.g. 45"
              className={`form-input ${errors.age ? 'error' : ''}`}
              value={formData.age}
              onChange={handleChange}
              required
            />
            {errors.age && <span className="error-text" id="patient-age-error" data-testid="patient-age-error">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="patient-gender-dropdown">Gender *</label>
            <select
              id="patient-gender-dropdown"
              name="gender"
              data-testid="patient-gender-dropdown"
              aria-label="Patient Gender"
              className={`form-select ${errors.gender ? 'error' : ''}`}
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="error-text" id="patient-gender-error" data-testid="patient-gender-error">{errors.gender}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="patient-phone-input">Phone Number * (10 Digits)</label>
          <input
            type="text"
            id="patient-phone-input"
            name="phone"
            data-testid="patient-phone-input"
            aria-label="Patient Phone Number"
            maxLength="10"
            placeholder="e.g. 9876543210"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <span className="error-text" id="patient-phone-error" data-testid="patient-phone-error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="patient-email-input">Email Address (Optional)</label>
          <input
            type="email"
            id="patient-email-input"
            name="email"
            data-testid="patient-email-input"
            aria-label="Patient Email Address"
            placeholder="e.g. patient@example.com"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-text" id="patient-email-error" data-testid="patient-email-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="patient-address-input">Residential Address (Optional)</label>
          <textarea
            id="patient-address-input"
            name="address"
            data-testid="patient-address-input"
            aria-label="Patient Address"
            rows="2"
            placeholder="e.g. Street name, City"
            className="form-textarea"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            id="cancel-patient-btn"
            data-testid="cancel-patient-btn"
            aria-label="Cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            id="save-patient-btn"
            data-testid="save-patient-btn"
            aria-label="Save Patient Record"
          >
            {isEdit ? 'Save Changes' : 'Register Patient'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
