export const INITIAL_DEFECTS = [
  {
    id: "DEF-001",
    title: "Duplicate details accepted during account creation",
    module: "Account Creation",
    severity: "Medium",
    priority: "High",
    stepsToReproduce: "1. Open the application.\n2. Go to Create Account.\n3. Enter already registered details.\n4. Click Create Account.",
    expectedResult: "System should display an error that the details are already registered.",
    actualResult: "System accepts duplicate registration without displaying an error.",
    status: "Resolved"
  },
  {
    id: "DEF-002",
    title: "Popup notification blocks Book New Appointment option",
    module: "Dashboard",
    severity: "Medium",
    priority: "High",
    stepsToReproduce: "1. Login to the application.\n2. Navigate to Dashboard.\n3. Observe the success popup.\n4. Try clicking Book New Appointment.",
    expectedResult: "Success popup should not block the Book New Appointment button.",
    actualResult: "Popup overlaps the Book New Appointment option, making it difficult to access.",
    status: "Resolved"
  }
];

const DEFECTS_KEY = 'medi_defects';

export const getDefects = () => {
  try {
    const data = localStorage.getItem(DEFECTS_KEY);
    if (!data) {
      localStorage.setItem(DEFECTS_KEY, JSON.stringify(INITIAL_DEFECTS));
      return INITIAL_DEFECTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading defects from LocalStorage:', err);
    return INITIAL_DEFECTS;
  }
};
