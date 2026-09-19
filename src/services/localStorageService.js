import {
  SAMPLE_ADMINS,
  SAMPLE_DOCTORS,
  SAMPLE_PATIENTS,
  SAMPLE_APPOINTMENTS
} from './seedData';

const KEYS = {
  ADMINS: 'medi_admins',
  DOCTORS: 'medi_doctors',
  PATIENTS: 'medi_patients',
  APPOINTMENTS: 'medi_appointments',
  SESSION: 'medi_admin_session'
};

// Initialize LocalStorage with seed data if empty
export const initializeLocalStorage = () => {
  if (!localStorage.getItem(KEYS.ADMINS)) {
    localStorage.setItem(KEYS.ADMINS, JSON.stringify(SAMPLE_ADMINS));
  }
  if (!localStorage.getItem(KEYS.DOCTORS)) {
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(SAMPLE_DOCTORS));
  }
  if (!localStorage.getItem(KEYS.PATIENTS)) {
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(SAMPLE_PATIENTS));
  }
  if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(SAMPLE_APPOINTMENTS));
  }
};

// Generic Helpers
const getCollection = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage:`, err);
    return [];
  }
};

const setCollection = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error(`Error writing ${key} to LocalStorage:`, err);
  }
};

// --- ADMIN & AUTH SERVICES ---
export const getAdmins = () => getCollection(KEYS.ADMINS);

export const authenticateAdmin = (username, password) => {
  const admins = getAdmins();
  const found = admins.find(
    (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
  );
  if (found) {
    const sessionData = {
      id: found.id,
      username: found.username,
      name: found.name,
      role: found.role,
      avatar: found.avatar,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(KEYS.SESSION, JSON.stringify(sessionData));
    return { success: true, user: sessionData };
  }
  return { success: false, message: 'Invalid username or password' };
};

export const getActiveAdminSession = () => {
  try {
    const session = localStorage.getItem(KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

export const clearAdminSession = () => {
  localStorage.removeItem(KEYS.SESSION);
};

// --- DOCTOR SERVICES ---
export const getDoctors = () => getCollection(KEYS.DOCTORS);

export const addDoctor = (doctorData) => {
  const doctors = getDoctors();
  const newDoctor = {
    id: `doc-${Date.now()}`,
    name: doctorData.name.trim(),
    image: doctorData.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    specialization: doctorData.specialization,
    qualification: doctorData.qualification.trim(),
    experience: Number(doctorData.experience),
    fee: Number(doctorData.fee),
    availableDays: doctorData.availableDays || [],
    availableSlots: doctorData.availableSlots || [],
    status: doctorData.status || "Available",
    createdAt: new Date().toISOString()
  };

  doctors.unshift(newDoctor);
  setCollection(KEYS.DOCTORS, doctors);
  return newDoctor;
};

export const updateDoctor = (id, doctorData) => {
  const doctors = getDoctors();
  const index = doctors.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const updatedDoctor = {
    ...doctors[index],
    ...doctorData,
    experience: Number(doctorData.experience),
    fee: Number(doctorData.fee)
  };

  doctors[index] = updatedDoctor;
  setCollection(KEYS.DOCTORS, doctors);
  return updatedDoctor;
};

export const deleteDoctor = (id) => {
  const doctors = getDoctors();
  const filtered = doctors.filter((d) => d.id !== id);
  setCollection(KEYS.DOCTORS, filtered);
  return true;
};

// --- PATIENT SERVICES ---
export const getPatients = () => getCollection(KEYS.PATIENTS);

export const addPatient = (patientData) => {
  const patients = getPatients();
  const newPatient = {
    id: `pat-${Date.now()}`,
    name: patientData.name.trim(),
    age: Number(patientData.age),
    gender: patientData.gender,
    phone: patientData.phone.trim(),
    email: patientData.email ? patientData.email.trim() : "",
    address: patientData.address ? patientData.address.trim() : "",
    createdAt: new Date().toISOString()
  };

  patients.unshift(newPatient);
  setCollection(KEYS.PATIENTS, patients);
  return newPatient;
};

export const updatePatient = (id, patientData) => {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedPatient = {
    ...patients[index],
    ...patientData,
    age: Number(patientData.age)
  };

  patients[index] = updatedPatient;
  setCollection(KEYS.PATIENTS, patients);
  return updatedPatient;
};

export const deletePatient = (id) => {
  const patients = getPatients();
  const filtered = patients.filter((p) => p.id !== id);
  setCollection(KEYS.PATIENTS, filtered);
  return true;
};

// --- APPOINTMENT SERVICES ---
export const getAppointments = () => getCollection(KEYS.APPOINTMENTS);

export const checkDuplicateBooking = (doctorId, date, timeSlot, excludeAppointmentId = null) => {
  const appointments = getAppointments();
  return appointments.some((apt) => {
    if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
    return (
      apt.doctorId === doctorId &&
      apt.date === date &&
      apt.timeSlot === timeSlot &&
      apt.status !== 'Cancelled'
    );
  });
};

export const addAppointment = (appointmentData) => {
  const isDuplicate = checkDuplicateBooking(
    appointmentData.doctorId,
    appointmentData.date,
    appointmentData.timeSlot
  );

  if (isDuplicate) {
    throw new Error('Doctor already has a booking for this date and time slot!');
  }

  const doctors = getDoctors();
  const patients = getPatients();

  const doctor = doctors.find((d) => d.id === appointmentData.doctorId);
  const patient = patients.find((p) => p.id === appointmentData.patientId);

  const appointments = getAppointments();
  const newAppointment = {
    id: `APT-${1000 + appointments.length + 1}`,
    patientId: appointmentData.patientId,
    patientName: patient ? patient.name : 'Unknown Patient',
    doctorId: appointmentData.doctorId,
    doctorName: doctor ? doctor.name : 'Unknown Doctor',
    specialization: doctor ? doctor.specialization : 'General',
    date: appointmentData.date,
    timeSlot: appointmentData.timeSlot,
    reason: appointmentData.reason.trim(),
    status: 'Scheduled',
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppointment);
  setCollection(KEYS.APPOINTMENTS, appointments);
  return newAppointment;
};

export const updateAppointment = (id, updateData) => {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) return null;

  if (updateData.doctorId && updateData.date && updateData.timeSlot) {
    const isDuplicate = checkDuplicateBooking(
      updateData.doctorId,
      updateData.date,
      updateData.timeSlot,
      id
    );
    if (isDuplicate) {
      throw new Error('Doctor already has another active booking for this date and time slot!');
    }
  }

  const updatedApt = {
    ...appointments[index],
    ...updateData
  };

  appointments[index] = updatedApt;
  setCollection(KEYS.APPOINTMENTS, appointments);
  return updatedApt;
};

export const updateAppointmentStatus = (id, newStatus) => {
  return updateAppointment(id, { status: newStatus });
};

export const deleteAppointment = (id) => {
  const appointments = getAppointments();
  const filtered = appointments.filter((a) => a.id !== id);
  setCollection(KEYS.APPOINTMENTS, filtered);
  return true;
};

// Calculate available time slots for a specific doctor on a target date
export const getAvailableSlotsForDoctorAndDate = (doctorId, targetDateStr) => {
  const doctors = getDoctors();
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor || doctor.status !== 'Available') return [];

  // Check if doctor works on this day of week
  const dateObj = new Date(targetDateStr + 'T00:00:00');
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  
  if (!doctor.availableDays.includes(dayName)) {
    return [];
  }

  // Get existing active appointments for doctor on date
  const appointments = getAppointments();
  const bookedSlots = appointments
    .filter((a) => a.doctorId === doctorId && a.date === targetDateStr && a.status !== 'Cancelled')
    .map((a) => a.timeSlot);

  // Return slots that are NOT booked
  return (doctor.availableSlots || []).filter((slot) => !bookedSlots.includes(slot));
};

// Statistics calculation for Dashboard
export const getDashboardStats = () => {
  const doctors = getDoctors();
  const patients = getPatients();
  const appointments = getAppointments();

  const todayStr = new Date().toISOString().split('T')[0];

  const totalDoctors = doctors.length;
  const availableDoctors = doctors.filter((d) => d.status === 'Available').length;
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;

  const todayAppointments = appointments.filter(
    (a) => a.date === todayStr && a.status !== 'Cancelled'
  ).length;

  const upcomingAppointments = appointments.filter((a) => {
    return a.date >= todayStr && a.status === 'Scheduled';
  }).length;

  return {
    totalDoctors,
    availableDoctors,
    totalPatients,
    totalAppointments,
    todayAppointments,
    upcomingAppointments
  };
};
