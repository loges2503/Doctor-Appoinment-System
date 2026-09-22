import React, { useState, useEffect } from 'react';
import { PatientModal } from '../components/patients/PatientModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient
} from '../services/localStorageService';
import {
  FaUserInjured,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { notify } from '../context/NotificationContext';
import './Patients.css';

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const loadPatients = () => {
    setPatients(getPatients());
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSavePatient = (formData) => {
    try {
      if (editingPatient) {
        updatePatient(editingPatient.id, formData);
        notify.success('Patient Record Updated Successfully!', 'Patient Updated');
      } else {
        addPatient(formData);
        notify.success('Patient Registered Successfully!', 'Patient Registered');
      }
      loadPatients();
    } catch (err) {
      notify.error(err.message || 'Failed to save patient record.', 'Error');
    }
  };

  const handleDeletePatientConfirm = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete.id);
      notify.success('Patient Record Deleted!', 'Patient Removed');
      loadPatients();
      setPatientToDelete(null);
    }
  };

  const handleOpenAddModal = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (patient) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  // Filter patients by search & gender
  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(term) ||
      patient.phone.includes(term) ||
      (patient.email && patient.email.toLowerCase().includes(term));

    const matchesGender = genderFilter === 'ALL' || patient.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  return (
    <div className="patients-page" id="patients-page" data-testid="patients-page">
      <div className="page-header" id="patients-header" data-testid="patients-header">
        <div>
          <h1 className="page-title" id="patients-title" data-testid="patients-title">Patient Directory</h1>
          <p className="page-subtitle" id="patients-subtitle" data-testid="patients-subtitle">Manage registered patient profiles, contact details, and records.</p>
        </div>
        <button
          className="btn btn-primary"
          id="add-patient-btn"
          data-testid="add-patient-btn"
          aria-label="Register New Patient"
          onClick={handleOpenAddModal}
        >
          <FaPlus /> Register New Patient
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card filter-card" id="patients-filter-card" data-testid="patients-filter-card">
        <div className="search-input-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            id="search-patient-input"
            name="searchPatient"
            data-testid="search-patient-input"
            aria-label="Search Patients"
            className="form-input search-field"
            placeholder="Search patients by name, phone number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label className="filter-label" htmlFor="gender-filter-select">Gender:</label>
          <select
            id="gender-filter-select"
            name="genderFilter"
            data-testid="gender-filter-select"
            aria-label="Filter by Gender"
            className="form-select filter-select"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Patient List Table */}
      <div className="card table-card" id="patients-table-card" data-testid="patients-table-card">
        {filteredPatients.length === 0 ? (
          <div className="empty-state-card" id="patients-empty-state" data-testid="patients-empty-state" style={{ border: 'none' }}>
            <div className="empty-icon-wrapper">
              <FaUserInjured />
            </div>
            <h3>No Patients Found</h3>
            <p>No patient records match your criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table" id="patient-table" data-testid="patient-table">
              <thead>
                <tr>
                  <th id="th-patient-id" data-testid="th-patient-id">Patient ID</th>
                  <th id="th-patient-name" data-testid="th-patient-name">Patient Name</th>
                  <th id="th-patient-age-gender" data-testid="th-patient-age-gender">Age / Gender</th>
                  <th id="th-patient-contact" data-testid="th-patient-contact">Contact Info</th>
                  <th id="th-patient-address" data-testid="th-patient-address">Address</th>
                  <th style={{ textAlign: 'right' }} id="th-patient-actions" data-testid="th-patient-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} id={`row-patient-${patient.id}`} data-testid={`row-patient-${patient.id}`}>
                    <td id={`col-patient-id-${patient.id}`}>
                      <strong style={{ color: '#14B8A6' }}>{patient.id}</strong>
                    </td>
                    <td id={`col-patient-name-${patient.id}`}>
                      <div className="patient-name-cell">
                        <div className="patient-avatar-mini">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{patient.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td id={`col-patient-age-gender-${patient.id}`}>
                      {patient.age} Yrs &bull; {patient.gender}
                    </td>
                    <td id={`col-patient-contact-${patient.id}`}>
                      <div className="contact-cell">
                        <div>
                          <FaPhoneAlt className="cell-icon" /> {patient.phone}
                        </div>
                        {patient.email && (
                          <div style={{ color: '#6B7280', fontSize: '0.78rem' }}>
                            <FaEnvelope className="cell-icon" /> {patient.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td id={`col-patient-address-${patient.id}`}>
                      <div className="address-cell">
                        <FaMapMarkerAlt className="cell-icon" />{' '}
                        {patient.address || <span style={{ color: '#9CA3AF' }}>Not provided</span>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-group">
                        <button
                          className="btn btn-outline btn-sm"
                          id={`edit-patient-btn-${patient.id}`}
                          data-testid={`edit-patient-btn-${patient.id}`}
                          aria-label={`Edit ${patient.name}`}
                          onClick={() => handleOpenEditModal(patient)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          id={`delete-patient-btn-${patient.id}`}
                          data-testid={`delete-patient-btn-${patient.id}`}
                          aria-label={`Delete ${patient.name}`}
                          style={{ color: '#EF4444' }}
                          onClick={() => handleOpenDeleteModal(patient)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
        patient={editingPatient}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePatientConfirm}
        title="Delete Patient Record"
        message={`Are you sure you want to remove patient ${patientToDelete?.name}?`}
        confirmText="Delete Record"
      />
    </div>
  );
};
