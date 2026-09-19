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
import toast from 'react-hot-toast';
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
      toast.success('Doctor Updated Successfully!');
    } else {
      addDoctor(formData);
      toast.success('Doctor Added Successfully!');
    }
    loadDoctors();
  };

  const handleDeleteDoctorConfirm = () => {
    if (doctorToDelete) {
      deleteDoctor(doctorToDelete.id);
      toast.success('Doctor Deleted Successfully!');
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
    <div className="doctors-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctor Directory</h1>
          <p className="page-subtitle">Manage medical personnel, schedules, and availability statuses.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <FaPlus /> Add New Doctor
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card filter-card">
        <div className="search-input-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-input search-field"
            placeholder="Search doctors by name or qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <label className="filter-label">Specialization:</label>
            <select
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
            <label className="filter-label">Availability:</label>
            <select
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
        <div className="card empty-state-card">
          <div className="empty-icon-wrapper">
            <FaUserMd />
          </div>
          <h3>No Doctors Found</h3>
          <p>Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.map((doctor) => (
            <div className="card doctor-card" key={doctor.id}>
              <div className="doctor-card-top">
                <img src={doctor.image} alt={doctor.name} className="doctor-card-avatar" />
                <div className="doctor-card-badge">
                  <Badge status={doctor.status} />
                </div>
              </div>

              <div className="doctor-card-body">
                <h3 className="doctor-card-name">{doctor.name}</h3>
                <span className="doctor-card-spec">{doctor.specialization}</span>
                <p className="doctor-card-qual">{doctor.qualification}</p>

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
                <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditModal(doctor)}>
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn btn-outline btn-sm text-danger"
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
