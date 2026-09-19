import React from 'react';
import { Modal } from './Modal';
import { FaExclamationTriangle } from 'react-icons/fa';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This step cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: isDanger ? '#FEE2E2' : '#EFF6FF',
            color: isDanger ? '#EF4444' : '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem'
          }}
        >
          <FaExclamationTriangle />
        </div>
        <p style={{ color: '#4B5563', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
