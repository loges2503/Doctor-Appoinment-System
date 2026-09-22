import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { getDoctors, getPatients, getAvailableSlotsForDoctorAndDate } from '../../services/localStorageService';
import { validateAppointmentForm } from '../../utils/validation';
import { getTodayISOString } from '../../utils/dateUtils';
import { notify } from '../../context/NotificationContext';

export const BookingModal = ({ isOpen, onClose, onSave }) => {
  const todayStr = getTodayISOString();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: todayStr,
    timeSlot: '',
    reason: ''
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const allPatients = getPatients();
      const allDoctors = getDoctors();
      const availableDocs = allDoctors.filter((d) => d.status === 'Available');

      setPatients(allPatients);
      setDoctors(availableDocs);

      const defaultDoctor = availableDocs.length > 0 ? availableDocs[0].id : '';
      const defaultPatient = allPatients.length > 0 ? allPatients[0].id : '';

      setFormData({
        patientId: defaultPatient,
        doctorId: defaultDoctor,
        date: todayStr,
        timeSlot: '',
        reason: ''
      });

      setErrors({});
    }
  }, [isOpen, todayStr]);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      const slots = getAvailableSlotsForDoctorAndDate(formData.doctorId, formData.date);
      setAvailableSlots(slots);
      
      if (slots.length > 0 && !slots.includes(formData.timeSlot)) {
        setFormData((prev) => ({ ...prev, timeSlot: slots[0] }));
      } else if (slots.length === 0) {
        setFormData((prev) => ({ ...prev, timeSlot: '' }));
      }
    } else {
      setAvailableSlots([]);
    }
  }, [formData.doctorId, formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateAppointmentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      notify.error('Please complete all required fields.', 'Validation Error');
      return;
    }

    try {
      onSave(formData);
      onClose();
    } catch (err) {
      notify.error(err.message || 'Failed to book appointment.', 'Booking Error');
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book New Appointment" maxWidth="560px">
      <form onSubmit={handleSubmit} id="booking-form" data-testid="booking-form" noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="patient-dropdown">Select Patient *</label>
          {patients.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: '#EF4444' }}>
              No patients registered. Please add a patient first.
            </div>
          ) : (
            <select
              id="patient-dropdown"
              name="patientId"
              data-testid="patient-dropdown"
              aria-label="Select Patient"
              className={`form-select ${errors.patientId ? 'error' : ''}`}
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Age: {p.age}, {p.phone})
                </option>
              ))}
            </select>
          )}
          {errors.patientId && <span className="error-text" id="patient-id-error" data-testid="patient-id-error">{errors.patientId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="doctor-dropdown">Select Doctor * (Only Available Doctors Listed)</label>
          {doctors.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: '#EF4444' }}>
              No available doctors found. (Doctors may be On Leave).
            </div>
          ) : (
            <select
              id="doctor-dropdown"
              name="doctorId"
              data-testid="doctor-dropdown"
              aria-label="Select Doctor"
              className={`form-select ${errors.doctorId ? 'error' : ''}`}
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialization}) - Fee: ${d.fee}
                </option>
              ))}
            </select>
          )}
          {errors.doctorId && <span className="error-text" id="doctor-id-error" data-testid="doctor-id-error">{errors.doctorId}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="appointment-date">Appointment Date *</label>
            <input
              type="date"
              id="appointment-date"
              name="date"
              data-testid="appointment-date"
              aria-label="Appointment Date"
              min={todayStr}
              className={`form-input ${errors.date ? 'error' : ''}`}
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && <span className="error-text" id="appointment-date-error" data-testid="appointment-date-error">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="appointment-time">Available Time Slots *</label>
            {availableSlots.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: '#B45309', padding: '0.4rem 0' }}>
                {selectedDoctor
                  ? 'No free slots on this date (Doctor off or fully booked).'
                  : 'Select doctor & date first.'}
              </div>
            ) : (
              <select
                id="appointment-time"
                name="timeSlot"
                data-testid="appointment-time"
                aria-label="Appointment Time Slot"
                className={`form-select ${errors.timeSlot ? 'error' : ''}`}
                value={formData.timeSlot}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Time Slot --</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            )}
            {errors.timeSlot && <span className="error-text" id="appointment-time-error" data-testid="appointment-time-error">{errors.timeSlot}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reason-input">Reason for Visit *</label>
          <textarea
            id="reason-input"
            name="reason"
            data-testid="reason-input"
            aria-label="Reason for Visit"
            rows="3"
            placeholder="e.g. General checkup, Follow-up on lab results, Chest pain"
            className={`form-textarea ${errors.reason ? 'error' : ''}`}
            value={formData.reason}
            onChange={handleChange}
            required
          />
          {errors.reason && <span className="error-text" id="reason-error" data-testid="reason-error">{errors.reason}</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            id="cancel-appointment"
            data-testid="cancel-appointment"
            aria-label="Cancel Appointment"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            id="submit-appointment"
            data-testid="submit-appointment"
            aria-label="Submit Appointment"
            disabled={!formData.patientId || !formData.doctorId || availableSlots.length === 0}
          >
            Book Appointment
          </button>
        </div>
      </form>
    </Modal>
  );
};
