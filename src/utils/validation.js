// Validation for Doctor Form
export const validateDoctorForm = (formData) => {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Doctor name is required.';
  }

  if (!formData.specialization) {
    errors.specialization = 'Specialization is required.';
  }

  if (!formData.qualification || !formData.qualification.trim()) {
    errors.qualification = 'Qualification is required.';
  }

  if (formData.experience === '' || formData.experience === null || Number(formData.experience) < 0) {
    errors.experience = 'Experience must be a positive number.';
  }

  if (formData.fee === '' || formData.fee === null || Number(formData.fee) <= 0) {
    errors.fee = 'Consultation fee must be greater than 0.';
  }

  if (!formData.availableDays || formData.availableDays.length === 0) {
    errors.availableDays = 'Select at least one available day.';
  }

  if (!formData.availableSlots || formData.availableSlots.length === 0) {
    errors.availableSlots = 'Select at least one available time slot.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validation for Patient Form
export const validatePatientForm = (formData) => {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Patient name is required.';
  } else if (formData.name.trim().length < 3) {
    errors.name = 'Patient name must be at least 3 characters.';
  }

  const ageNum = Number(formData.age);
  if (formData.age === '' || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
    errors.age = 'Age must be between 1 and 120.';
  }

  const phoneStr = (formData.phone || '').trim();
  if (!phoneStr) {
    errors.phone = 'Phone number is required.';
  } else if (!/^\d{10}$/.test(phoneStr)) {
    errors.phone = 'Phone number must contain exactly 10 digits.';
  }

  if (!formData.gender) {
    errors.gender = 'Gender selection is required.';
  }

  if (formData.email && formData.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validation for Appointment Booking Form
export const validateAppointmentForm = (formData) => {
  const errors = {};

  if (!formData.patientId) {
    errors.patientId = 'Please select a patient.';
  }

  if (!formData.doctorId) {
    errors.doctorId = 'Please select a doctor.';
  }

  if (!formData.date) {
    errors.date = 'Date is required.';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date + 'T00:00:00');
    if (selectedDate < today) {
      errors.date = 'Appointment date cannot be in the past.';
    }
  }

  if (!formData.timeSlot) {
    errors.timeSlot = 'Please select an available time slot.';
  }

  if (!formData.reason || !formData.reason.trim()) {
    errors.reason = 'Reason for visit is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
