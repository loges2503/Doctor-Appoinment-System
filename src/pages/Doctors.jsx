import React, { useState, useEffect } from 'react';
import { Badge } from '../components/common/Badge';
import { DoctorModal } from '../components/doctors/DoctorModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor
} from '../services/localStorageService';
import { SPECIALIZATIONS_LIST } from '../services/seedData';
import {
  FaUserMd,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBriefcase,
  FaDollarSign,
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa';
import { notify } from '../context/NotificationContext';
import './Doctors.css';

export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const loadDoctors = () => {
    setDoctors(getDoctors());
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleSaveDoctor = (formData) => {
    if (editingDoctor) {
      updateDoctor(editingDoctor.id, formData);
      notify.success('Doctor details updated successfully!', 'Doctor Updated');
    } else {
      addDoctor(formData);
      notify.success('New doctor profile added successfully!', 'Doctor Added');
    }
    loadDoctors();
  };

  const handleDeleteDoctorConfirm = () => {
    if (doctorToDelete) {
      deleteDoctor(doctorToDelete.id);
      notify.success('Doctor profile removed successfully.', 'Doctor Deleted');
      loadDoctors();
      setDoctorToDelete(null);
    }
  };

  const handleOpenAddModal = () => {
    setEditingDoctor(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  // Filtering & Search
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpec = selectedSpec === 'ALL' || doc.specialization === selectedSpec;
    const matchesStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;

    return matchesSearch && matchesSpec && matchesStatus;
  });

  return (
    <div className="doctors-page" id="doctors-page" data-testid="doctors-page">
      <div className="page-header" id="doctors-header" data-testid="doctors-header">
        <div>
          <h1 className="page-title" id="doctors-title" data-testid="doctors-title">Doctor Directory</h1>
          <p className="page-subtitle" id="doctors-subtitle" data-testid="doctors-subtitle">Manage medical personnel, schedules, and availability statuses.</p>
        </div>
        <button
          className="btn btn-primary"
          id="add-doctor-btn"
          data-testid="add-doctor-btn"
          aria-label="Add New Doctor"
          onClick={handleOpenAddModal}
        >
          <FaPlus /> Add New Doctor
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card filter-card" id="doctors-filter-card" data-testid="doctors-filter-card">
        <div className="search-input-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            id="search-doctor-input"
            name="searchDoctor"
            data-testid="search-doctor-input"
            aria-label="Search Doctors"
            className="form-input search-field"
            placeholder="Search doctors by name or qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <label className="filter-label" htmlFor="specialization-filter-select">Specialization:</label>
            <select
              id="specialization-filter-select"
              name="specializationFilter"
              data-testid="specialization-filter-select"
              aria-label="Filter by Specialization"
              className="form-select filter-select"
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
            >
              <option value="ALL">All Specializations</option>
              {SPECIALIZATIONS_LIST.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label" htmlFor="availability-filter-select">Availability:</label>
            <select
              id="availability-filter-select"
              name="availabilityFilter"
              data-testid="availability-filter-select"
              aria-label="Filter by Availability"
              className="form-select filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="card empty-state-card" id="doctors-empty-state" data-testid="doctors-empty-state">
          <div className="empty-icon-wrapper">
            <FaUserMd />
          </div>
          <h3>No Doctors Found</h3>
          <p>Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="doctors-grid" id="doctors-grid" data-testid="doctors-grid">
          {filteredDoctors.map((doctor) => (
            <div
              className="card doctor-card"
              key={doctor.id}
              id={`doctor-card-${doctor.id}`}
              data-testid={`doctor-card-${doctor.id}`}
            >
              <div className="doctor-card-top">
                <img src={doctor.image} alt={doctor.name} className="doctor-card-avatar" />
                <div className="doctor-card-badge">
                  <Badge status={doctor.status} id={`badge-doctor-${doctor.id}`} />
                </div>
              </div>

              <div className="doctor-card-body">
                <h3 className="doctor-card-name" id={`doctor-name-${doctor.id}`}>{doctor.name}</h3>
                <span className="doctor-card-spec" id={`doctor-spec-${doctor.id}`}>{doctor.specialization}</span>
                <p className="doctor-card-qual" id={`doctor-qual-${doctor.id}`}>{doctor.qualification}</p>

                <div className="doctor-meta-list">
                  <div className="meta-item">
                    <FaBriefcase className="meta-icon" />
                    <span>{doctor.experience} Years Exp.</span>
                  </div>
                  <div className="meta-item">
                    <FaDollarSign className="meta-icon" />
                    <span>${doctor.fee} Fee</span>
                  </div>
                  <div className="meta-item" style={{ gridColumn: 'span 2' }}>
                    <FaCalendarAlt className="meta-icon" />
                    <span className="truncated-text">
                      {(doctor.availableDays || []).map((d) => d.substring(0, 3)).join(', ')}
                    </span>
                  </div>
                  <div className="meta-item" style={{ gridColumn: 'span 2' }}>
                    <FaClock className="meta-icon" />
                    <span className="truncated-text">
                      {(doctor.availableSlots || []).length} Time Slots Configured
                    </span>
                  </div>
                </div>
              </div>

              <div className="doctor-card-actions">
                <button
                  className="btn btn-outline btn-sm"
                  id={`edit-doctor-btn-${doctor.id}`}
                  data-testid={`edit-doctor-btn-${doctor.id}`}
                  aria-label={`Edit ${doctor.name}`}
                  onClick={() => handleOpenEditModal(doctor)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn btn-outline btn-sm text-danger"
                  id={`delete-doctor-btn-${doctor.id}`}
                  data-testid={`delete-doctor-btn-${doctor.id}`}
                  aria-label={`Delete ${doctor.name}`}
                  style={{ color: '#EF4444' }}
                  onClick={() => handleOpenDeleteModal(doctor)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Modal */}
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDoctor}
        doctor={editingDoctor}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteDoctorConfirm}
        title="Delete Doctor Profile"
        message={`Are you sure you want to remove ${doctorToDelete?.name}? This action will permanently remove their records.`}
        confirmText="Delete Doctor"
      />
    </div>
  );
};
