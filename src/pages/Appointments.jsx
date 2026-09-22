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
import { notify } from '../context/NotificationContext';
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, doctorFilter, specFilter, statusFilter, dateFilter, sortOrder]);

  const handleBookingSave = (formData) => {
    try {
      addAppointment(formData);
      notify.success('Appointment Booked Successfully!', 'Booking Confirmed');
      loadData();
    } catch (err) {
      notify.error(err.message || 'Failed to book appointment.', 'Booking Error');
    }
  };

  const handleStatusChange = (aptId, newStatus) => {
    try {
      updateAppointmentStatus(aptId, newStatus);
      notify.success(`Appointment status updated to ${newStatus}!`, 'Status Updated');
      loadData();
    } catch (err) {
      notify.error(err.message || 'Failed to update status.', 'Status Error');
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
      notify.success('Appointment record deleted successfully!', 'Appointment Removed');
      loadData();
    }
    setIsConfirmOpen(false);
  };

  // Export handlers
  const handleExportCSV = () => {
    try {
      exportAppointmentsToCSV(filteredAppointments);
      notify.success('CSV Export Downloaded Successfully!', 'CSV Export');
    } catch (err) {
      notify.error(err.message || 'CSV Export Failed.', 'Export Error');
    }
  };

  const handleExportPDF = () => {
    try {
      exportAppointmentsToPDF(filteredAppointments);
      notify.success('PDF Report Generated & Downloaded!', 'PDF Export');
    } catch (err) {
      notify.error(err.message || 'PDF Export Failed.', 'Export Error');
    }
  };

  return (
    <div className="appointments-page" id="appointments-page" data-testid="appointments-page">
      <div className="page-header" id="appointments-header" data-testid="appointments-header">
        <div>
          <h1 className="page-title" id="appointments-title" data-testid="appointments-title">Appointment Management</h1>
          <p className="page-subtitle" id="appointments-subtitle" data-testid="appointments-subtitle">Schedule, filter, monitor status, and export appointment lists.</p>
        </div>
        <div className="header-export-actions">
          <button
            className="btn btn-outline"
            id="export-csv-btn"
            data-testid="export-csv-btn"
            aria-label="Export CSV"
            onClick={handleExportCSV}
          >
            <FaFileCsv style={{ color: '#10B981' }} /> Export CSV
          </button>
          <button
            className="btn btn-outline"
            id="export-pdf-btn"
            data-testid="export-pdf-btn"
            aria-label="Export PDF"
            onClick={handleExportPDF}
          >
            <FaFilePdf style={{ color: '#EF4444' }} /> Export PDF
          </button>
          <button
            className="btn btn-primary"
            id="book-appointment-btn"
            data-testid="book-appointment-btn"
            aria-label="Book Appointment"
            onClick={() => setIsBookingOpen(true)}
          >
            <FaPlus /> Book Appointment
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="card filter-card" id="appointments-filter-card" data-testid="appointments-filter-card">
        <div className="search-input-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            id="search-appointment-input"
            name="searchAppointment"
            data-testid="search-appointment-input"
            aria-label="Search Appointments"
            className="form-input search-field"
            placeholder="Search by ID, patient, doctor, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-item">
            <label className="filter-label" htmlFor="doctor-filter-select">Doctor:</label>
            <select
              id="doctor-filter-select"
              name="doctorFilter"
              data-testid="doctor-filter-select"
              aria-label="Filter by Doctor"
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
            <label className="filter-label" htmlFor="spec-filter-select">Specialization:</label>
            <select
              id="spec-filter-select"
              name="specFilter"
              data-testid="spec-filter-select"
              aria-label="Filter by Specialization"
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
            <label className="filter-label" htmlFor="status-filter-select">Status:</label>
            <select
              id="status-filter-select"
              name="statusFilter"
              data-testid="status-filter-select"
              aria-label="Filter by Status"
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
            <label className="filter-label" htmlFor="date-filter-input">Date:</label>
            <input
              type="date"
              id="date-filter-input"
              name="dateFilter"
              data-testid="date-filter-input"
              aria-label="Filter by Date"
              className="form-input filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button
                className="btn btn-outline btn-sm"
                id="clear-date-filter-btn"
                data-testid="clear-date-filter-btn"
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
              id="sort-date-btn"
              data-testid="sort-date-btn"
              aria-label="Toggle Sort Order"
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
      <div className="card table-card" id="appointments-table-card" data-testid="appointments-table-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredAppointments.length === 0 ? (
          <div className="empty-state-card" id="appointments-empty-state" data-testid="appointments-empty-state" style={{ padding: '3rem' }}>
            <div className="empty-icon-wrapper">
              <FaCalendarCheck />
            </div>
            <h3>No Appointments Found</h3>
            <p>No records match your selected filters.</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table" id="appointment-table" data-testid="appointment-table">
                <thead>
                  <tr>
                    <th id="th-apt-id" data-testid="th-apt-id">APT ID</th>
                    <th id="th-apt-patient" data-testid="th-apt-patient">Patient Name</th>
                    <th id="th-apt-doctor" data-testid="th-apt-doctor">Doctor Name</th>
                    <th id="th-apt-spec" data-testid="th-apt-spec">Specialization</th>
                    <th id="th-apt-datetime" data-testid="th-apt-datetime">Date & Time</th>
                    <th id="th-apt-reason" data-testid="th-apt-reason">Reason</th>
                    <th id="th-apt-status" data-testid="th-apt-status">Status</th>
                    <th style={{ textAlign: 'right' }} id="th-apt-actions" data-testid="th-apt-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppointments.map((apt) => (
                    <tr key={apt.id} id={`row-apt-${apt.id}`} data-testid={`row-apt-${apt.id}`}>
                      <td id={`col-apt-id-${apt.id}`}>
                        <strong style={{ color: '#3B82F6' }}>{apt.id}</strong>
                      </td>
                      <td id={`col-apt-patient-${apt.id}`}>
                        <strong>{apt.patientName}</strong>
                      </td>
                      <td id={`col-apt-doctor-${apt.id}`}>{apt.doctorName}</td>
                      <td id={`col-apt-spec-${apt.id}`}>
                        <span className="spec-badge-text">{apt.specialization}</span>
                      </td>
                      <td id={`col-apt-datetime-${apt.id}`}>
                        <div>{formatDateDisplay(apt.date)}</div>
                        <small style={{ color: '#6B7280' }}>{apt.timeSlot}</small>
                      </td>
                      <td id={`col-apt-reason-${apt.id}`}>
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
                      <td id={`col-apt-status-${apt.id}`}>
                        <Badge status={apt.status} id={`badge-apt-${apt.id}`} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="apt-actions-group">
                          {apt.status === 'Scheduled' && (
                            <>
                              <button
                                className="btn btn-outline btn-sm text-success"
                                id={`complete-apt-btn-${apt.id}`}
                                data-testid={`complete-apt-btn-${apt.id}`}
                                aria-label={`Complete ${apt.id}`}
                                onClick={() => handleStatusChange(apt.id, 'Completed')}
                                title="Mark as Completed"
                              >
                                <FaCheckCircle style={{ color: '#22C55E' }} /> Complete
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                id={`cancel-apt-btn-${apt.id}`}
                                data-testid={`cancel-apt-btn-${apt.id}`}
                                aria-label={`Cancel ${apt.id}`}
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
                            id={`delete-apt-btn-${apt.id}`}
                            data-testid={`delete-apt-btn-${apt.id}`}
                            aria-label={`Delete ${apt.id}`}
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
