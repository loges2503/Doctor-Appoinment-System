import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  getDashboardStats,
  getAppointments,
  getDoctors,
  addAppointment
} from '../services/localStorageService';
import { BookingModal } from '../components/appointments/BookingModal';
import { formatDateDisplay } from '../utils/dateUtils';
import {
  FaUserMd,
  FaUserInjured,
  FaCalendarAlt,
  FaCalendarDay,
  FaUserCheck,
  FaPlus,
  FaArrowRight
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { notify } from '../context/NotificationContext';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    availableDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    upcomingAppointments: 0
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [specializationChartData, setSpecializationChartData] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const loadDashboardData = () => {
    const currentStats = getDashboardStats();
    setStats(currentStats);

    const appointments = getAppointments();
    setRecentAppointments(appointments.slice(0, 5));

    // Specialization count calculation for bar chart
    const doctors = getDoctors();
    const specMap = {};
    doctors.forEach((doc) => {
      specMap[doc.specialization] = (specMap[doc.specialization] || 0) + 1;
    });
    const specData = Object.keys(specMap).map((key) => ({
      name: key,
      doctors: specMap[key]
    }));
    setSpecializationChartData(specData);

    // Status breakdown for Pie Chart
    const statusMap = { Scheduled: 0, Completed: 0, Cancelled: 0 };
    appointments.forEach((apt) => {
      if (statusMap[apt.status] !== undefined) {
        statusMap[apt.status] += 1;
      }
    });
    const pieData = [
      { name: 'Scheduled', value: statusMap.Scheduled || 0, color: '#3B82F6' },
      { name: 'Completed', value: statusMap.Completed || 0, color: '#22C55E' },
      { name: 'Cancelled', value: statusMap.Cancelled || 0, color: '#EF4444' }
    ];
    setStatusChartData(pieData);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleBookingSave = (appointmentData) => {
    try {
      addAppointment(appointmentData);
      notify.success('Appointment booked successfully!', 'Booking Confirmed');
      loadDashboardData();
    } catch (err) {
      notify.error(err.message || 'Failed to book appointment.', 'Booking Failed');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clinic Reception Overview</h1>
          <p className="page-subtitle">Real-time stats and management overview for receptionist.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsBookingOpen(true)}>
            <FaPlus /> Book New Appointment
          </button>
        </div>
      </div>

      {/* Statistic Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={<FaUserMd />}
          badgeText="Staff"
          badgeColor="blue"
          accentColor="#3B82F6"
        />
        <StatCard
          title="Available Doctors"
          value={stats.availableDoctors}
          icon={<FaUserCheck />}
          badgeText="Active"
          badgeColor="green"
          accentColor="#22C55E"
        />
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<FaUserInjured />}
          badgeText="Registered"
          badgeColor="teal"
          accentColor="#14B8A6"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={<FaCalendarDay />}
          badgeText="Today"
          badgeColor="orange"
          accentColor="#F59E0B"
        />
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={<FaCalendarAlt />}
          badgeText="Upcoming"
          badgeColor="blue"
          accentColor="#3B82F6"
        />
      </div>

      {/* Visual Charts Section */}
      <div className="dashboard-charts-grid">
        <div className="card chart-card">
          <h3 className="chart-title">Doctors per Specialization</h3>
          <p className="chart-subtitle">Distribution of medical experts across departments</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={specializationChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="doctors" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <h3 className="chart-title">Appointment Status Breakdown</h3>
          <p className="chart-subtitle">Proportion of scheduled, completed, and cancelled visits</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Appointments Preview */}
      <div className="card recent-appointments-card">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Recent Appointments</h3>
            <p className="card-subtitle">Latest bookings processed by clinic reception</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/appointments')}>
            View All <FaArrowRight />
          </button>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#6B7280', padding: '2rem' }}>
                    No recent appointments found.
                  </td>
                </tr>
              ) : (
                recentAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <strong style={{ color: '#3B82F6' }}>{apt.id}</strong>
                    </td>
                    <td>{apt.patientName}</td>
                    <td>
                      {apt.doctorName}
                      <br />
                      <small style={{ color: '#6B7280' }}>{apt.specialization}</small>
                    </td>
                    <td>
                      {formatDateDisplay(apt.date)}
                      <br />
                      <small style={{ color: '#6B7280' }}>{apt.timeSlot}</small>
                    </td>
                    <td>
                      <Badge status={apt.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSave={handleBookingSave}
      />
    </div>
  );
};
