import React from 'react';

export const Badge = ({ status, type }) => {
  const getBadgeClass = () => {
    const s = (status || type || '').toLowerCase();
    switch (s) {
      case 'available':
      case 'completed':
      case 'success':
      case 'active':
        return 'badge-success';
      case 'scheduled':
      case 'upcoming':
      case 'info':
        return 'badge-blue';
      case 'on leave':
      case 'warning':
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
      case 'error':
      case 'inactive':
        return 'badge-error';
      default:
        return 'badge-gray';
    }
  };

  return <span className={`badge ${getBadgeClass()}`}>{status || type}</span>;
};
