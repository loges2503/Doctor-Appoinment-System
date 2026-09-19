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
import toast from 'react-hot-toast';
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
    if (editingPatient) {
      updatePatient(editingPatient.id, formData);
      toast.success('Patient Record Updated Successfully!');
    } else {
      addPatient(formData);
      toast.success('Patient Registered Successfully!');
    }
    loadPatients();
  };

  const handleDeletePatientConfirm = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete.id);
      toast.success('Patient Record Deleted!');
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
    <div className="patients-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Patient Directory</h1>
          <p className="page-subtitle">Manage registered patient profiles, contact details, and records.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <FaPlus /> Register New Patient
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card filter-card">
        <div className="search-input-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-input search-field"
            placeholder="Search patients by name, phone number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">Gender:</label>
          <select
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
      <div className="card table-card">
        {filteredPatients.length === 0 ? (
          <div className="empty-state-card" style={{ border: 'none' }}>
            <div className="empty-icon-wrapper">
              <FaUserInjured />
            </div>
            <h3>No Patients Found</h3>
            <p>No patient records match your criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Age / Gender</th>
                  <th>Contact Info</th>
                  <th>Address</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <strong style={{ color: '#14B8A6' }}>{patient.id}</strong>
                    </td>
                    <td>
                      <div className="patient-name-cell">
                        <div className="patient-avatar-mini">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{patient.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      {patient.age} Yrs &bull; {patient.gender}
                    </td>
                    <td>
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
                    <td>
                      <div className="address-cell">
                        <FaMapMarkerAlt className="cell-icon" />{' '}
                        {patient.address || <span style={{ color: '#9CA3AF' }}>Not provided</span>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-group">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleOpenEditModal(patient)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
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
