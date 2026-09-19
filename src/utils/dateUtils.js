export const getTodayISOString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const [year, month, day] = dateString.split('-');
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const getDayNameFromDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
};
