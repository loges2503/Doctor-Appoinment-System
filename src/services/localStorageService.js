import {
  SAMPLE_ADMINS,
  SAMPLE_DOCTORS,
  SAMPLE_PATIENTS,
  SAMPLE_APPOINTMENTS,
  SAMPLE_BILLING
} from './seedData';

const KEYS = {
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  ADMINS: 'medi_admins',
  SESSION: 'medi_admin_session',
  DOCTORS: 'medi_doctors',
  PATIENTS: 'medi_patients',
  APPOINTMENTS: 'medi_appointments',
  BILLING: 'medi_billing'
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

// Initialize LocalStorage with seed data
export const initializeLocalStorage = () => {
  let usersData = getCollection(KEYS.USERS);

  if (!usersData || usersData.length === 0) {
    setCollection(KEYS.USERS, SAMPLE_ADMINS);
    setCollection(KEYS.ADMINS, SAMPLE_ADMINS);
  } else {
    // Ensure all 3 predefined test accounts (admin, doctor, reception) exist
    let updated = false;
    SAMPLE_ADMINS.forEach((sampleUser) => {
      const exists = usersData.some((u) => u.username === sampleUser.username);
      if (!exists) {
        usersData.push(sampleUser);
        updated = true;
      }
    });
    if (updated) {
      setCollection(KEYS.USERS, usersData);
      setCollection(KEYS.ADMINS, usersData);
    }
  }

  if (!localStorage.getItem(KEYS.DOCTORS)) {
    setCollection(KEYS.DOCTORS, SAMPLE_DOCTORS);
  }
  if (!localStorage.getItem(KEYS.PATIENTS)) {
    setCollection(KEYS.PATIENTS, SAMPLE_PATIENTS);
  }
  if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
    setCollection(KEYS.APPOINTMENTS, SAMPLE_APPOINTMENTS);
  }
  if (!localStorage.getItem(KEYS.BILLING)) {
    setCollection(KEYS.BILLING, SAMPLE_BILLING);
  }
};

// --- AUTH & USER SERVICES ---
export const getUsers = () => {
  initializeLocalStorage();
  const users = getCollection(KEYS.USERS);
  if (!users || users.length === 0) {
    setCollection(KEYS.USERS, SAMPLE_ADMINS);
    return SAMPLE_ADMINS;
  }
  return users;
};

export const getAdmins = getUsers;

export const authenticateAdmin = (identifier, password) => {
  const users = getUsers();
  const cleanInput = (identifier || '').trim().toLowerCase();

  // Match username OR email, and exact password
  const found = users.find((u) => {
    const matchUsername = u.username && u.username.trim().toLowerCase() === cleanInput;
    const matchEmail = u.email && u.email.trim().toLowerCase() === cleanInput;
    return (matchUsername || matchEmail) && u.password === password;
  });

  if (found) {
    const sessionData = {
      id: found.id,
      username: found.username,
      fullName: found.fullName || found.name || found.username,
      name: found.name || found.fullName || found.username,
      role: found.role || "Administrator",
      designation: found.designation || "Administrator",
      clinicName: found.clinicName || "MediCare Clinic & Hospital",
      email: found.email || "",
      phone: found.phone || "",
      gender: found.gender || "",
      dob: found.dob || "",
      address: found.address || "",
      dateJoined: found.dateJoined || new Date().toISOString().split('T')[0],
      avatar: found.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      loginTime: new Date().toISOString()
    };
    
    // Save current logged-in user to LocalStorage
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(sessionData));
    localStorage.setItem(KEYS.SESSION, JSON.stringify(sessionData));
    
    return { success: true, user: sessionData };
  }

  return { success: false, message: 'Invalid Username/Email or Password' };
};

export const updateAdminProfile = (adminId, updatedFields) => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === adminId);
  
  if (index === -1) {
    throw new Error('User account not found.');
  }

  const updatedUser = {
    ...users[index],
    fullName: updatedFields.name ? updatedFields.name.trim() : (users[index].fullName || users[index].name),
    name: updatedFields.name ? updatedFields.name.trim() : users[index].name,
    email: updatedFields.email ? updatedFields.email.trim() : users[index].email,
    phone: updatedFields.phone ? updatedFields.phone.trim() : users[index].phone,
    clinicName: updatedFields.clinicName ? updatedFields.clinicName.trim() : users[index].clinicName,
    address: updatedFields.address ? updatedFields.address.trim() : users[index].address,
    avatar: updatedFields.avatar ? updatedFields.avatar.trim() : users[index].avatar
  };

  users[index] = updatedUser;
  setCollection(KEYS.USERS, users);
  setCollection(KEYS.ADMINS, users);

  const activeSession = getActiveAdminSession();
  if (activeSession && activeSession.id === adminId) {
    const updatedSession = {
      ...activeSession,
      fullName: updatedUser.fullName,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      clinicName: updatedUser.clinicName,
      address: updatedUser.address,
      avatar: updatedUser.avatar
    };
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updatedSession));
    localStorage.setItem(KEYS.SESSION, JSON.stringify(updatedSession));
  }

  return updatedUser;
};

export const getAdminProfile = (adminId) => {
  const users = getUsers();
  const found = users.find((u) => u.id === adminId);
  if (found) return found;
  return getActiveAdminSession();
};

export const getActiveAdminSession = () => {
  try {
    const currentUser = localStorage.getItem(KEYS.CURRENT_USER);
    if (currentUser) return JSON.parse(currentUser);

    const session = localStorage.getItem(KEYS.SESSION);
    if (session) return JSON.parse(session);

    return null;
  } catch {
    return null;
  }
};

export const clearAdminSession = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
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
  const cleanPhone = patientData.phone.trim();
  const existingPatientPhone = patients.some((p) => p.phone === cleanPhone);
  if (existingPatientPhone) {
    throw new Error('A patient with this phone number is already registered.');
  }

  const newPatient = {
    id: `pat-${Date.now()}`,
    name: patientData.name.trim(),
    age: Number(patientData.age),
    gender: patientData.gender,
    phone: cleanPhone,
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

export const getAvailableSlotsForDoctorAndDate = (doctorId, targetDateStr) => {
  const doctors = getDoctors();
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor || doctor.status !== 'Available') return [];

  const dateObj = new Date(targetDateStr + 'T00:00:00');
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  
  if (!doctor.availableDays || !doctor.availableDays.includes(dayName)) {
    return [];
  }

  const appointments = getAppointments();
  const bookedSlots = appointments
    .filter((a) => a.doctorId === doctorId && a.date === targetDateStr && a.status !== 'Cancelled')
    .map((a) => a.timeSlot);

  return (doctor.availableSlots || []).filter((slot) => !bookedSlots.includes(slot));
};

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
