import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { SPECIALIZATIONS_LIST, DAYS_OF_WEEK, DEFAULT_TIME_SLOTS } from '../../services/seedData';
import { validateDoctorForm } from '../../utils/validation';
import { notify } from '../../context/NotificationContext';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80"
];

export const DoctorModal = ({ isOpen, onClose, onSave, doctor = null }) => {
  const isEdit = !!doctor;

  const [formData, setFormData] = useState({
    name: '',
    image: PRESET_AVATARS[0],
    specialization: SPECIALIZATIONS_LIST[0],
    qualification: '',
    experience: '',
    fee: '',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM'],
    status: 'Available'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        image: doctor.image || PRESET_AVATARS[0],
        specialization: doctor.specialization || SPECIALIZATIONS_LIST[0],
        qualification: doctor.qualification || '',
        experience: doctor.experience !== undefined ? String(doctor.experience) : '',
        fee: doctor.fee !== undefined ? String(doctor.fee) : '',
        availableDays: doctor.availableDays || [],
        availableSlots: doctor.availableSlots || [],
        status: doctor.status || 'Available'
      });
    } else {
      setFormData({
        name: '',
        image: PRESET_AVATARS[0],
        specialization: SPECIALIZATIONS_LIST[0],
        qualification: '',
        experience: '',
        fee: '',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM'],
        status: 'Available'
      });
    }
    setErrors({});
  }, [doctor, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.availableDays.includes(day);
      const updated = exists
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: updated };
    });
    if (errors.availableDays) {
      setErrors((prev) => ({ ...prev, availableDays: null }));
    }
  };

  const handleSlotToggle = (slot) => {
    setFormData((prev) => {
      const exists = prev.availableSlots.includes(slot);
      const updated = exists
        ? prev.availableSlots.filter((s) => s !== slot)
        : [...prev.availableSlots, slot];
      return { ...prev, availableSlots: updated };
    });
    if (errors.availableSlots) {
      setErrors((prev) => ({ ...prev, availableSlots: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateDoctorForm(formData);
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
      title={isEdit ? 'Edit Doctor Profile' : 'Add New Doctor'}
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit} id="doctor-form" data-testid="doctor-form" noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="doctor-name-input">Doctor Name *</label>
            <input
              type="text"
              id="doctor-name-input"
              name="name"
              data-testid="doctor-name-input"
              aria-label="Doctor Name"
              placeholder="e.g. Dr. Sarah Jenkins"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span className="error-text" id="doctor-name-error" data-testid="doctor-name-error">{errors.name}</span>}
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Profile Avatar</label>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {PRESET_AVATARS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Avatar ${idx + 1}`}
                  id={`preset-avatar-${idx}`}
                  data-testid={`preset-avatar-${idx}`}
                  onClick={() => setFormData((prev) => ({ ...prev, image: url }))}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: formData.image === url ? '3px solid #3B82F6' : '2px solid #E2E8F0',
                    transform: formData.image === url ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
            <input
              type="url"
              id="doctor-image-input"
              name="image"
              data-testid="doctor-image-input"
              aria-label="Doctor Avatar URL"
              placeholder="Or enter custom image URL"
              className="form-input"
              style={{ marginTop: '8px' }}
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="doctor-spec-dropdown">Specialization *</label>
            <select
              id="doctor-spec-dropdown"
              name="specialization"
              data-testid="doctor-spec-dropdown"
              aria-label="Doctor Specialization"
              className={`form-select ${errors.specialization ? 'error' : ''}`}
              value={formData.specialization}
              onChange={handleChange}
              required
            >
              {SPECIALIZATIONS_LIST.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            {errors.specialization && <span className="error-text" id="doctor-spec-error" data-testid="doctor-spec-error">{errors.specialization}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="doctor-status-dropdown">Status</label>
            <select
              id="doctor-status-dropdown"
              name="status"
              data-testid="doctor-status-dropdown"
              aria-label="Doctor Status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="doctor-qual-input">Qualification *</label>
            <input
              type="text"
              id="doctor-qual-input"
              name="qualification"
              data-testid="doctor-qual-input"
              aria-label="Doctor Qualification"
              placeholder="e.g. MBBS, MD (Cardiology)"
              className={`form-input ${errors.qualification ? 'error' : ''}`}
              value={formData.qualification}
              onChange={handleChange}
              required
            />
            {errors.qualification && <span className="error-text" id="doctor-qual-error" data-testid="doctor-qual-error">{errors.qualification}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="doctor-exp-input">Experience (Years) *</label>
            <input
              type="number"
              id="doctor-exp-input"
              name="experience"
              data-testid="doctor-exp-input"
              aria-label="Doctor Experience"
              min="0"
              placeholder="e.g. 10"
              className={`form-input ${errors.experience ? 'error' : ''}`}
              value={formData.experience}
              onChange={handleChange}
              required
            />
            {errors.experience && <span className="error-text" id="doctor-exp-error" data-testid="doctor-exp-error">{errors.experience}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="doctor-fee-input">Consultation Fee ($) *</label>
            <input
              type="number"
              id="doctor-fee-input"
              name="fee"
              data-testid="doctor-fee-input"
              aria-label="Doctor Consultation Fee"
              min="1"
              placeholder="e.g. 150"
              className={`form-input ${errors.fee ? 'error' : ''}`}
              value={formData.fee}
              onChange={handleChange}
              required
            />
            {errors.fee && <span className="error-text" id="doctor-fee-error" data-testid="doctor-fee-error">{errors.fee}</span>}
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Available Working Days *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = formData.availableDays.includes(day);
                const dayId = `day-${day.toLowerCase()}`;
                return (
                  <button
                    type="button"
                    key={day}
                    id={dayId}
                    data-testid={dayId}
                    aria-label={`Toggle ${day}`}
                    onClick={() => handleDayToggle(day)}
                    style={{
                      padding: '0.35rem 0.7rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      border: '1px solid',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      borderColor: isSelected ? '#3B82F6' : '#E2E8F0',
                      color: isSelected ? '#3B82F6' : '#6B7280',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>
            {errors.availableDays && <span className="error-text" id="doctor-days-error" data-testid="doctor-days-error">{errors.availableDays}</span>}
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Available Time Slots *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '6px', marginTop: '4px' }}>
              {DEFAULT_TIME_SLOTS.map((slot, idx) => {
                const isSelected = formData.availableSlots.includes(slot);
                const slotId = `slot-${idx}`;
                return (
                  <button
                    type="button"
                    key={slot}
                    id={slotId}
                    data-testid={slotId}
                    aria-label={`Toggle slot ${slot}`}
                    onClick={() => handleSlotToggle(slot)}
                    style={{
                      padding: '0.35rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      border: '1px solid',
                      cursor: 'pointer',
                      textAlign: 'center',
                      backgroundColor: isSelected ? '#F0FDFA' : '#FFFFFF',
                      borderColor: isSelected ? '#14B8A6' : '#E2E8F0',
                      color: isSelected ? '#0D9488' : '#6B7280',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            {errors.availableSlots && <span className="error-text" id="doctor-slots-error" data-testid="doctor-slots-error">{errors.availableSlots}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            id="cancel-doctor-btn"
            data-testid="cancel-doctor-btn"
            aria-label="Cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            id="save-doctor-btn"
            data-testid="save-doctor-btn"
            aria-label="Save Doctor Profile"
          >
            {isEdit ? 'Save Changes' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
