import React, { useState, useEffect } from 'react';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { BookingModal } from '../components/appointments/BookingModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  getAppointments,
  getDoctors,
  addAppointment,
  updateAppointmentStatus,
  deleteAppointment
} from '../services/localStorageService';
import { exportAppointmentsToCSV, exportAppointmentsToPDF } from '../services/exportService';
import { SPECIALIZATIONS_LIST } from '../services/seedData';
import { formatDateDisplay } from '../utils/dateUtils';
import {
  FaCalendarCheck,
  FaSearch,
  FaPlus,
  FaFilePdf,
  FaFileCsv,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Appointments.css';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [specFilter, setSpecFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    action: null,
    aptId: null,
    title: '',
    message: ''
  });

  const loadData = () => {
    setAppointments(getAppointments());
    setDoctors(getDoctors());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter & Sorting Logic
  const filteredAppointments = appointments
    .filter((apt) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        apt.id.toLowerCase().includes(term) ||
        apt.patientName.toLowerCase().includes(term) ||
        apt.doctorName.toLowerCase().includes(term) ||
        (apt.reason && apt.reason.toLowerCase().includes(term));

      const matchesDoctor = doctorFilter === 'ALL' || apt.doctorId === doctorFilter;
      const matchesSpec = specFilter === 'ALL' || apt.specialization === specFilter;
      const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
      const matchesDate = !dateFilter || apt.date === dateFilter;

      return matchesSearch && matchesDoctor && matchesSpec && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date + 'T' + (a.timeSlot ? a.timeSlot.split(' - ')[0] : '00:00'));
      const dateB = new Date(b.date + 'T' + (b.timeSlot ? b.timeSlot.split(' - ')[0] : '00:00'));
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, doctorFilter, specFilter, statusFilter, dateFilter, sortOrder]);

  const handleBookingSave = (formData) => {
    try {
      addAppointment(formData);
      toast.success('Appointment Booked Successfully!');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to book appointment.');
    }
  };

  const handleStatusChange = (aptId, newStatus) => {
    try {
      updateAppointmentStatus(aptId, newStatus);
      toast.success(`Appointment ${newStatus}!`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    }
  };

  const handleOpenCancelConfirm = (apt) => {
    setConfirmConfig({
      action: 'CANCEL',
      aptId: apt.id,
      title: 'Cancel Appointment',
      message: `Are you sure you want to cancel appointment ${apt.id} for ${apt.patientName}?`
    });
    setIsConfirmOpen(true);
  };

  const handleOpenDeleteConfirm = (apt) => {
    setConfirmConfig({
      action: 'DELETE',
      aptId: apt.id,
      title: 'Delete Appointment Record',
      message: `Are you sure you want to permanently delete appointment record ${apt.id}?`
    });
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (!confirmConfig.aptId) return;

    if (confirmConfig.action === 'CANCEL') {
      handleStatusChange(confirmConfig.aptId, 'Cancelled');
    } else if (confirmConfig.action === 'DELETE') {
      deleteAppointment(confirmConfig.aptId);
      toast.success('Appointment Deleted Successfully!');
      loadData();
    }
    setIsConfirmOpen(false);
  };

  // Export handlers
  const handleExportCSV = () => {
    try {
      exportAppointmentsToCSV(filteredAppointments);
      toast.success('CSV Export Downloaded!');
    } catch (err) {
      toast.error(err.message || 'CSV Export Failed.');
    }
  };

  const handleExportPDF = () => {
    try {
      exportAppointmentsToPDF(filteredAppointments);
      toast.success('PDF Export Downloaded!');
    } catch (err) {
      toast.error(err.message || 'PDF Export Failed.');
    }
  };

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointment Management</h1>
          <p className="page-subtitle">Schedule, filter, monitor status, and export appointment lists.</p>
        </div>
        <div className="header-export-actions">
          <button className="btn btn-outline" onClick={handleExportCSV}>
            <FaFileCsv style={{ color: '#10B981' }} /> Export CSV
          </button>
          <button className="btn btn-outline" onClick={handleExportPDF}>
            <FaFilePdf style={{ color: '#EF4444' }} /> Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => setIsBookingOpen(true)}>
            <FaPlus /> Book Appointment
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="card filter-card">
        <div className="search-input-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-input search-field"
            placeholder="Search by ID, patient, doctor, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-item">
            <label className="filter-label">Doctor:</label>
            <select
              className="form-select filter-select"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            >
              <option value="ALL">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Specialization:</label>
            <select
              className="form-select filter-select"
              value={specFilter}
              onChange={(e) => setSpecFilter(e.target.value)}
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
            <label className="filter-label">Status:</label>
            <select
              className="form-select filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Date:</label>
            <input
              type="date"
              className="form-input filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setDateFilter('')}
                title="Clear date filter"
              >
                Clear
              </button>
            )}
          </div>

          <div className="filter-item">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title="Toggle Sort Date Order"
            >
              {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />} Date (
              {sortOrder.toUpperCase()})
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="card table-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredAppointments.length === 0 ? (
          <div className="empty-state-card" style={{ padding: '3rem' }}>
            <div className="empty-icon-wrapper">
              <FaCalendarCheck />
            </div>
            <h3>No Appointments Found</h3>
            <p>No records match your selected filters.</p>
          </div>
        ) : (
          <>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>APT ID</th>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <strong style={{ color: '#3B82F6' }}>{apt.id}</strong>
                      </td>
                      <td>
                        <strong>{apt.patientName}</strong>
                      </td>
                      <td>{apt.doctorName}</td>
                      <td>
                        <span className="spec-badge-text">{apt.specialization}</span>
                      </td>
                      <td>
                        <div>{formatDateDisplay(apt.date)}</div>
                        <small style={{ color: '#6B7280' }}>{apt.timeSlot}</small>
                      </td>
                      <td>
                        <span
                          style={{ fontSize: '0.8125rem', color: '#4B5563' }}
                          title={apt.reason}
                        >
                          {apt.reason
                            ? apt.reason.length > 32
                              ? apt.reason.substring(0, 30) + '...'
                              : apt.reason
                            : 'N/A'}
                        </span>
                      </td>
                      <td>
                        <Badge status={apt.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="apt-actions-group">
                          {apt.status === 'Scheduled' && (
                            <>
                              <button
                                className="btn btn-outline btn-sm text-success"
                                onClick={() => handleStatusChange(apt.id, 'Completed')}
                                title="Mark as Completed"
                              >
                                <FaCheckCircle style={{ color: '#22C55E' }} /> Complete
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ color: '#F59E0B' }}
                                onClick={() => handleOpenCancelConfirm(apt)}
                                title="Cancel Appointment"
                              >
                                <FaTimesCircle /> Cancel
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: '#EF4444' }}
                            onClick={() => handleOpenDeleteConfirm(apt)}
                            title="Delete Appointment"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              totalItems={filteredAppointments.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSave={handleBookingSave}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.action === 'CANCEL' ? 'Cancel Appointment' : 'Delete'}
        isDanger={confirmConfig.action === 'DELETE'}
      />
    </div>
  );
};
