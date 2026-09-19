export const SAMPLE_ADMINS = [
  {
    id: "ADM1001",
    username: "admin",
    password: "Admin@123",
    name: "Sarah Jenkins",
    role: "Administrator",
    designation: "Chief Administrator",
    clinicName: "MediCare Clinic & Hospital",
    email: "admin@medicare.com",
    phone: "9876543210",
    address: "742 Healthcare Boulevard, Suite 100",
    dateJoined: "2024-01-15",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
  }
];

export const SAMPLE_DOCTORS = [
  {
    id: "doc-101",
    name: "Dr. Alexander Wright",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    specialization: "Cardiology",
    qualification: "MD, FACC (Cardiology)",
    experience: 12,
    fee: 150,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableSlots: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM"],
    status: "Available"
  },
  {
    id: "doc-102",
    name: "Dr. Elena Rostova",
    image: "https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&w=300&q=80",
    specialization: "Pediatrics",
    qualification: "MBBS, DCH, MD (Pediatrics)",
    experience: 9,
    fee: 120,
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    availableSlots: ["09:00 AM - 10:00 AM", "11:00 AM - 12:00 PM", "01:00 PM - 02:00 PM", "04:00 PM - 05:00 PM"],
    status: "Available"
  },
  {
    id: "doc-103",
    name: "Dr. Marcus Vance",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
    specialization: "Neurology",
    qualification: "MD, DM (Neurology)",
    experience: 15,
    fee: 180,
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableSlots: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "03:00 PM - 04:00 PM"],
    status: "Available"
  },
  {
    id: "doc-104",
    name: "Dr. Sophia Patel",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
    specialization: "Dermatology",
    qualification: "MD (Dermatology, Venereology)",
    experience: 8,
    fee: 130,
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    availableSlots: ["09:30 AM - 10:30 AM", "11:30 AM - 12:30 PM", "02:30 PM - 03:30 PM"],
    status: "Available"
  },
  {
    id: "doc-105",
    name: "Dr. Jonathan Chen",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
    specialization: "Orthopedics",
    qualification: "MS (Orthopedics), MCh",
    experience: 14,
    fee: 160,
    availableDays: ["Monday", "Wednesday", "Thursday"],
    availableSlots: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "02:00 PM - 03:00 PM"],
    status: "On Leave"
  }
];

export const SAMPLE_PATIENTS = [
  {
    id: "pat-201",
    name: "Robert Miller",
    age: 45,
    gender: "Male",
    phone: "9876543210",
    email: "robert.m@gmail.com",
    address: "742 Evergreen Terrace, Springfield"
  },
  {
    id: "pat-202",
    name: "Emily Watson",
    age: 29,
    gender: "Female",
    phone: "9123456789",
    email: "emily.watson@example.com",
    address: "123 Baker Street, London"
  },
  {
    id: "pat-203",
    name: "Michael Chang",
    age: 62,
    gender: "Male",
    phone: "9811223344",
    email: "m.chang@health.net",
    address: "456 Maple Avenue, Seattle"
  },
  {
    id: "pat-204",
    name: "Samantha Reed",
    age: 34,
    gender: "Female",
    phone: "9788990011",
    email: "sam.reed@outlook.com",
    address: "89 Pine Boulevard, Chicago"
  },
  {
    id: "pat-205",
    name: "David Kim",
    age: 18,
    gender: "Male",
    phone: "9655443322",
    email: "dkim@techcorp.io",
    address: "12 Silicon Heights, San Jose"
  }
];

// Helper to get relative dates (YYYY-MM-DD)
const getRelativeDateStr = (offsetDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
};

export const SAMPLE_APPOINTMENTS = [
  {
    id: "APT-1001",
    patientId: "pat-201",
    patientName: "Robert Miller",
    doctorId: "doc-101",
    doctorName: "Dr. Alexander Wright",
    specialization: "Cardiology",
    date: getRelativeDateStr(0), // Today
    timeSlot: "09:00 AM - 10:00 AM",
    reason: "Routine cardiac checkup and ECG review",
    status: "Scheduled",
    createdAt: new Date().toISOString()
  },
  {
    id: "APT-1002",
    patientId: "pat-202",
    patientName: "Emily Watson",
    doctorId: "doc-102",
    doctorName: "Dr. Elena Rostova",
    specialization: "Pediatrics",
    date: getRelativeDateStr(0), // Today
    timeSlot: "11:00 AM - 12:00 PM",
    reason: "Pediatric consultation for fever",
    status: "Completed",
    createdAt: new Date().toISOString()
  },
  {
    id: "APT-1003",
    patientId: "pat-203",
    patientName: "Michael Chang",
    doctorId: "doc-103",
    doctorName: "Dr. Marcus Vance",
    specialization: "Neurology",
    date: getRelativeDateStr(1), // Tomorrow
    timeSlot: "10:00 AM - 11:00 AM",
    reason: "Chronic migraine follow-up consultation",
    status: "Scheduled",
    createdAt: new Date().toISOString()
  },
  {
    id: "APT-1004",
    patientId: "pat-204",
    patientName: "Samantha Reed",
    doctorId: "doc-104",
    doctorName: "Dr. Sophia Patel",
    specialization: "Dermatology",
    date: getRelativeDateStr(2), // 2 days from now
    timeSlot: "09:30 AM - 10:30 AM",
    reason: "Skin allergy evaluation",
    status: "Scheduled",
    createdAt: new Date().toISOString()
  },
  {
    id: "APT-1005",
    patientId: "pat-205",
    patientName: "David Kim",
    doctorId: "doc-101",
    doctorName: "Dr. Alexander Wright",
    specialization: "Cardiology",
    date: getRelativeDateStr(-1), // Yesterday
    timeSlot: "02:00 PM - 03:00 PM",
    reason: "Pre-sports physical clearance",
    status: "Completed",
    createdAt: new Date().toISOString()
  },
  {
    id: "APT-1006",
    patientId: "pat-201",
    patientName: "Robert Miller",
    doctorId: "doc-103",
    doctorName: "Dr. Marcus Vance",
    specialization: "Neurology",
    date: getRelativeDateStr(-2), // 2 days ago
    timeSlot: "03:00 PM - 04:00 PM",
    reason: "Dizziness investigation",
    status: "Cancelled",
    createdAt: new Date().toISOString()
  }
];

export const SPECIALIZATIONS_LIST = [
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "Dermatology",
  "Orthopedics",
  "General Medicine",
  "Gynecology",
  "Ophthalmology",
  "Psychiatry",
  "ENT (Ear, Nose, Throat)"
];

export const DEFAULT_TIME_SLOTS = [
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM"
];

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
