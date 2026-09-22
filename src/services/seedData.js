export const SAMPLE_ADMINS = [
  {
    id: "ADM1001",
    fullName: "Sarah Jenkins",
    name: "Sarah Jenkins",
    username: "admin",
    password: "Admin@123",
    role: "Administrator",
    designation: "Chief Administrator",
    clinicName: "MediCare Clinic & Hospital",
    email: "admin@medicare.com",
    phone: "9876543210",
    gender: "Female",
    dob: "1985-05-15",
    address: "742 Healthcare Boulevard, Suite 100",
    dateJoined: "2024-01-15",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "DOC1002",
    fullName: "Dr. Alexander Wright",
    name: "Dr. Alexander Wright",
    username: "doctor",
    password: "Doctor@123",
    role: "Doctor",
    designation: "Senior Cardiologist",
    clinicName: "MediCare Clinic & Hospital",
    email: "doctor@medicare.com",
    phone: "9876543211",
    gender: "Male",
    dob: "1980-09-12",
    address: "101 Medical Plaza",
    dateJoined: "2024-02-01",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "RCP1003",
    fullName: "Reception Desk User",
    name: "Reception Desk User",
    username: "reception",
    password: "Reception@123",
    role: "Receptionist",
    designation: "Front Desk Manager",
    clinicName: "MediCare Clinic & Hospital",
    email: "reception@medicare.com",
    phone: "9876543212",
    gender: "Female",
    dob: "1992-03-24",
    address: "202 Reception Terminal",
    dateJoined: "2024-03-15",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
  }
];

export const SPECIALIZATIONS_LIST = [
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "Dermatology",
  "Orthopedics"
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
  },
  {
    id: "doc-106",
    name: "Dr. Rachel Green",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80",
    specialization: "Cardiology",
    qualification: "MD, DM (Cardiology)",
    experience: 11,
    fee: 170,
    availableDays: ["Monday", "Tuesday", "Friday"],
    availableSlots: ["10:00 AM - 11:00 AM", "01:00 PM - 02:00 PM"],
    status: "Available"
  },
  {
    id: "doc-107",
    name: "Dr. David Miller",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    specialization: "Pediatrics",
    qualification: "MD (Pediatrics)",
    experience: 7,
    fee: 110,
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableSlots: ["09:00 AM - 10:00 AM", "02:00 PM - 03:00 PM"],
    status: "Available"
  },
  {
    id: "doc-108",
    name: "Dr. Lisa Ray",
    image: "https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&w=300&q=80",
    specialization: "Neurology",
    qualification: "MD (Neurology)",
    experience: 13,
    fee: 175,
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableSlots: ["11:00 AM - 12:00 PM", "03:00 PM - 04:00 PM"],
    status: "Available"
  },
  {
    id: "doc-109",
    name: "Dr. Robert Taylor",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
    specialization: "Dermatology",
    qualification: "MD (Dermatology)",
    experience: 10,
    fee: 140,
    availableDays: ["Tuesday", "Thursday"],
    availableSlots: ["09:00 AM - 10:00 AM", "11:00 AM - 12:00 PM"],
    status: "Available"
  },
  {
    id: "doc-110",
    name: "Dr. Amanda White",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
    specialization: "Orthopedics",
    qualification: "MS (Orthopedics)",
    experience: 6,
    fee: 150,
    availableDays: ["Wednesday", "Friday", "Saturday"],
    availableSlots: ["10:00 AM - 11:00 AM", "02:00 PM - 03:00 PM"],
    status: "Available"
  }
];

export const SAMPLE_PATIENTS = [
  { id: "pat-201", name: "Robert Miller", age: 45, gender: "Male", phone: "9876543210", email: "robert.m@gmail.com", address: "742 Evergreen Terrace" },
  { id: "pat-202", name: "Emily Watson", age: 29, gender: "Female", phone: "9123456789", email: "emily.watson@example.com", address: "123 Baker Street" },
  { id: "pat-203", name: "Michael Chang", age: 62, gender: "Male", phone: "9811223344", email: "m.chang@health.net", address: "456 Maple Avenue" },
  { id: "pat-204", name: "Samantha Reed", age: 34, gender: "Female", phone: "9788990011", email: "sam.reed@outlook.com", address: "89 Pine Boulevard" },
  { id: "pat-205", name: "David Kim", age: 18, gender: "Male", phone: "9655443322", email: "dkim@techcorp.io", address: "12 Silicon Heights" },
  { id: "pat-206", name: "Jennifer Aniston", age: 40, gender: "Female", phone: "9870001111", email: "jennifer.a@gmail.com", address: "10 Beverly Hills" },
  { id: "pat-207", name: "James Wilson", age: 52, gender: "Male", phone: "9870002222", email: "jwilson@med.org", address: "15 Princeton Ave" },
  { id: "pat-208", name: "Patricia Clark", age: 38, gender: "Female", phone: "9870003333", email: "pclark@domain.com", address: "22 Sunset Blvd" },
  { id: "pat-209", name: "Daniel Martinez", age: 27, gender: "Male", phone: "9870004444", email: "dmartinez@yahoo.com", address: "88 Ocean Drive" },
  { id: "pat-210", name: "Linda Anderson", age: 61, gender: "Female", phone: "9870005555", email: "landerson@gmail.com", address: "44 Highland Park" },
  { id: "pat-211", name: "Paul Walker", age: 43, gender: "Male", phone: "9870006666", email: "pwalker@fast.net", address: "55 Race Track Rd" },
  { id: "pat-212", name: "Nancy Drew", age: 22, gender: "Female", phone: "9870007777", email: "ndrew@mystery.com", address: "1 Riverside Dr" },
  { id: "pat-213", name: "George Harrison", age: 55, gender: "Male", phone: "9870008888", email: "george@abbeyroad.com", address: "7 Beatles Way" },
  { id: "pat-214", name: "Karen Page", age: 31, gender: "Female", phone: "9870009999", email: "kpage@bulletin.com", address: "12 Hell's Kitchen" },
  { id: "pat-215", name: "Steven Strange", age: 42, gender: "Male", phone: "9871110000", email: "drstrange@sanctum.org", address: "177A Bleecker St" },
  { id: "pat-216", name: "Wanda Maximoff", age: 29, gender: "Female", phone: "9871112222", email: "wanda@westview.com", address: "303 Vision Way" },
  { id: "pat-217", name: "Bruce Wayne", age: 39, gender: "Male", phone: "9871113333", email: "bwayne@waynent.com", address: "100 Wayne Manor" },
  { id: "pat-218", name: "Diana Prince", age: 30, gender: "Female", phone: "9871114444", email: "diana@themyscira.gov", address: "45 Museum Ave" },
  { id: "pat-219", name: "Clark Kent", age: 33, gender: "Male", phone: "9871115555", email: "ckent@dailyplanet.com", address: "34 Metropolis Plaza" },
  { id: "pat-220", name: "Natasha Romanoff", age: 35, gender: "Female", phone: "9871116666", email: "natasha@shield.gov", address: "88 Red Room St" }
];

const getRelativeDateStr = (offsetDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
};

export const SAMPLE_APPOINTMENTS = [
  { id: "APT-1001", patientId: "pat-201", patientName: "Robert Miller", doctorId: "doc-101", doctorName: "Dr. Alexander Wright", specialization: "Cardiology", date: getRelativeDateStr(0), timeSlot: "09:00 AM - 10:00 AM", reason: "Routine cardiac checkup", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1002", patientId: "pat-202", patientName: "Emily Watson", doctorId: "doc-102", doctorName: "Dr. Elena Rostova", specialization: "Pediatrics", date: getRelativeDateStr(0), timeSlot: "11:00 AM - 12:00 PM", reason: "Fever consultation", status: "Completed", createdAt: new Date().toISOString() },
  { id: "APT-1003", patientId: "pat-203", patientName: "Michael Chang", doctorId: "doc-103", doctorName: "Dr. Marcus Vance", specialization: "Neurology", date: getRelativeDateStr(1), timeSlot: "10:00 AM - 11:00 AM", reason: "Migraine follow-up", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1004", patientId: "pat-204", patientName: "Samantha Reed", doctorId: "doc-104", doctorName: "Dr. Sophia Patel", specialization: "Dermatology", date: getRelativeDateStr(2), timeSlot: "09:30 AM - 10:30 AM", reason: "Skin allergy test", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1005", patientId: "pat-205", patientName: "David Kim", doctorId: "doc-105", doctorName: "Dr. Jonathan Chen", specialization: "Orthopedics", date: getRelativeDateStr(-1), timeSlot: "02:00 PM - 03:00 PM", reason: "Knee pain examination", status: "Completed", createdAt: new Date().toISOString() },
  { id: "APT-1006", patientId: "pat-206", patientName: "Jennifer Aniston", doctorId: "doc-106", doctorName: "Dr. Rachel Green", specialization: "Cardiology", date: getRelativeDateStr(0), timeSlot: "10:00 AM - 11:00 AM", reason: "ECG Consultation", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1007", patientId: "pat-207", patientName: "James Wilson", doctorId: "doc-107", doctorName: "Dr. David Miller", specialization: "Pediatrics", date: getRelativeDateStr(1), timeSlot: "09:00 AM - 10:00 AM", reason: "Childhood immunizations", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1008", patientId: "pat-208", patientName: "Patricia Clark", doctorId: "doc-108", doctorName: "Dr. Lisa Ray", specialization: "Neurology", date: getRelativeDateStr(3), timeSlot: "11:00 AM - 12:00 PM", reason: "Nerve conduction check", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1009", patientId: "pat-209", patientName: "Daniel Martinez", doctorId: "doc-109", doctorName: "Dr. Robert Taylor", specialization: "Dermatology", date: getRelativeDateStr(-2), timeSlot: "09:00 AM - 10:00 AM", reason: "Mole check", status: "Completed", createdAt: new Date().toISOString() },
  { id: "APT-1010", patientId: "pat-210", patientName: "Linda Anderson", doctorId: "doc-110", doctorName: "Dr. Amanda White", specialization: "Orthopedics", date: getRelativeDateStr(2), timeSlot: "10:00 AM - 11:00 AM", reason: "X-ray review", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1011", patientId: "pat-211", patientName: "Paul Walker", doctorId: "doc-101", doctorName: "Dr. Alexander Wright", specialization: "Cardiology", date: getRelativeDateStr(1), timeSlot: "02:00 PM - 03:00 PM", reason: "Blood pressure evaluation", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1012", patientId: "pat-212", patientName: "Nancy Drew", doctorId: "doc-102", doctorName: "Dr. Elena Rostova", specialization: "Pediatrics", date: getRelativeDateStr(-1), timeSlot: "01:00 PM - 02:00 PM", reason: "General wellness exam", status: "Completed", createdAt: new Date().toISOString() },
  { id: "APT-1013", patientId: "pat-213", patientName: "George Harrison", doctorId: "doc-103", doctorName: "Dr. Marcus Vance", specialization: "Neurology", date: getRelativeDateStr(4), timeSlot: "03:00 PM - 04:00 PM", reason: "Sleep disorder consult", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1014", patientId: "pat-214", patientName: "Karen Page", doctorId: "doc-104", doctorName: "Dr. Sophia Patel", specialization: "Dermatology", date: getRelativeDateStr(0), timeSlot: "02:30 PM - 03:30 PM", reason: "Acne treatment plan", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1015", patientId: "pat-215", patientName: "Steven Strange", doctorId: "doc-105", doctorName: "Dr. Jonathan Chen", specialization: "Orthopedics", date: getRelativeDateStr(5), timeSlot: "09:00 AM - 10:00 AM", reason: "Wrist joint evaluation", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1016", patientId: "pat-216", patientName: "Wanda Maximoff", doctorId: "doc-106", doctorName: "Dr. Rachel Green", specialization: "Cardiology", date: getRelativeDateStr(-3), timeSlot: "01:00 PM - 02:00 PM", reason: "Stress test review", status: "Completed", createdAt: new Date().toISOString() },
  { id: "APT-1017", patientId: "pat-217", patientName: "Bruce Wayne", doctorId: "doc-107", doctorName: "Dr. David Miller", specialization: "Pediatrics", date: getRelativeDateStr(2), timeSlot: "02:00 PM - 03:00 PM", reason: "Routine growth check", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1018", patientId: "pat-218", patientName: "Diana Prince", doctorId: "doc-108", doctorName: "Dr. Lisa Ray", specialization: "Neurology", date: getRelativeDateStr(1), timeSlot: "03:00 PM - 04:00 PM", reason: "Spine screening", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1019", patientId: "pat-219", patientName: "Clark Kent", doctorId: "doc-109", doctorName: "Dr. Robert Taylor", specialization: "Dermatology", date: getRelativeDateStr(-4), timeSlot: "11:00 AM - 12:00 PM", reason: "Skin allergy follow-up", status: "Completed", createdAt: new Date().toISOString() },
  { id: "APT-1020", patientId: "pat-220", patientName: "Natasha Romanoff", doctorId: "doc-110", doctorName: "Dr. Amanda White", specialization: "Orthopedics", date: getRelativeDateStr(3), timeSlot: "02:00 PM - 03:00 PM", reason: "Ankle sprain checkup", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1021", patientId: "pat-201", patientName: "Robert Miller", doctorId: "doc-106", doctorName: "Dr. Rachel Green", specialization: "Cardiology", date: getRelativeDateStr(6), timeSlot: "10:00 AM - 11:00 AM", reason: "Second opinion cardiac", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1022", patientId: "pat-202", patientName: "Emily Watson", doctorId: "doc-109", doctorName: "Dr. Robert Taylor", specialization: "Dermatology", date: getRelativeDateStr(4), timeSlot: "09:00 AM - 10:00 AM", reason: "Cosmetic skin consult", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1023", patientId: "pat-203", patientName: "Michael Chang", doctorId: "doc-108", doctorName: "Dr. Lisa Ray", specialization: "Neurology", date: getRelativeDateStr(-5), timeSlot: "11:00 AM - 12:00 PM", reason: "Headache diagnostic", status: "Cancelled", createdAt: new Date().toISOString() },
  { id: "APT-1024", patientId: "pat-204", patientName: "Samantha Reed", doctorId: "doc-110", doctorName: "Dr. Amanda White", specialization: "Orthopedics", date: getRelativeDateStr(7), timeSlot: "10:00 AM - 11:00 AM", reason: "Back strain check", status: "Scheduled", createdAt: new Date().toISOString() },
  { id: "APT-1025", patientId: "pat-205", patientName: "David Kim", doctorId: "doc-107", doctorName: "Dr. David Miller", specialization: "Pediatrics", date: getRelativeDateStr(5), timeSlot: "09:00 AM - 10:00 AM", reason: "Annual physical", status: "Scheduled", createdAt: new Date().toISOString() }
];

export const SAMPLE_BILLING = [
  { id: "INV-5001", patientName: "Robert Miller", doctorName: "Dr. Alexander Wright", amount: 150, status: "Paid", date: getRelativeDateStr(-1) },
  { id: "INV-5002", patientName: "Emily Watson", doctorName: "Dr. Elena Rostova", amount: 120, status: "Paid", date: getRelativeDateStr(0) },
  { id: "INV-5003", patientName: "Michael Chang", doctorName: "Dr. Marcus Vance", amount: 180, status: "Pending", date: getRelativeDateStr(1) },
  { id: "INV-5004", patientName: "Samantha Reed", doctorName: "Dr. Sophia Patel", amount: 130, status: "Pending", date: getRelativeDateStr(2) },
  { id: "INV-5005", patientName: "David Kim", doctorName: "Dr. Jonathan Chen", amount: 160, status: "Paid", date: getRelativeDateStr(-2) }
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
