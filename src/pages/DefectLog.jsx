import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDefects } from '../services/defectData';
import { FaBug, FaSearch, FaFilter, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './DefectLog.css';

export const DefectLog = () => {
  const [defects, setDefects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    setDefects(getDefects());
  }, []);

  const filteredDefects = defects.filter((defect) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      defect.id.toLowerCase().includes(term) ||
      defect.title.toLowerCase().includes(term) ||
      defect.module.toLowerCase().includes(term) ||
      defect.stepsToReproduce.toLowerCase().includes(term) ||
      defect.expectedResult.toLowerCase().includes(term) ||
      defect.actualResult.toLowerCase().includes(term);

    const matchesSeverity = severityFilter === 'ALL' || defect.severity === severityFilter;
    const matchesPriority = priorityFilter === 'ALL' || defect.priority === priorityFilter;

    return matchesSearch && matchesSeverity && matchesPriority;
  });

  const getSeverityBadgeClass = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'severity-badge-high';
      case 'medium':
        return 'severity-badge-medium';
      case 'low':
        return 'severity-badge-low';
      default:
        return 'severity-badge-gray';
    }
  };

  return (
    <div className="defect-log-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Defect Log</h1>
          <p className="page-subtitle">Track, monitor, and audit system defects and QA logs.</p>
        </div>
        <div className="header-stat-pill">
          <FaBug className="bug-icon" /> Total Logged: <strong>{defects.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card filter-card">
        <div className="search-input-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-input search-field"
            placeholder="Search defects by ID, title, module, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <label className="filter-label">Severity:</label>
            <select
              className="form-select filter-select"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="ALL">All Severities</option>
              <option value="High">High (Red)</option>
              <option value="Medium">Medium (Orange)</option>
              <option value="Low">Low (Green)</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Priority:</label>
            <select
              className="form-select filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Defect Log Table */}
      <div className="card table-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredDefects.length === 0 ? (
          <div className="empty-state-card" style={{ padding: '3rem' }}>
            <div className="empty-icon-wrapper">
              <FaBug />
            </div>
            <h3>No Defect Records Found</h3>
            <p>No defects match your current search query or filter selection.</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table defect-table">
              <thead>
                <tr>
                  <th>Defect ID</th>
                  <th>Defect Title</th>
                  <th>Module</th>
                  <th>Severity</th>
                  <th>Priority</th>
                  <th>Steps to Reproduce</th>
                  <th>Expected Result</th>
                  <th>Actual Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredDefects.map((defect) => (
                  <tr key={defect.id}>
                    <td>
                      <strong className="defect-id-badge">{defect.id}</strong>
                    </td>
                    <td>
                      <strong className="defect-title-text">{defect.title}</strong>
                    </td>
                    <td>
                      <span className="module-tag">{defect.module}</span>
                    </td>
                    <td>
                      <span className={`severity-badge ${getSeverityBadgeClass(defect.severity)}`}>
                        {defect.severity}
                      </span>
                    </td>
                    <td>
                      <span className="priority-badge">
                        {defect.priority}
                      </span>
                    </td>
                    <td>
                      <div className="multiline-text steps-box">
                        {defect.stepsToReproduce}
                      </div>
                    </td>
                    <td>
                      <div className="multiline-text expected-box">
                        {defect.expectedResult}
                      </div>
                    </td>
                    <td>
                      <div className="multiline-text actual-box">
                        {defect.actualResult}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
