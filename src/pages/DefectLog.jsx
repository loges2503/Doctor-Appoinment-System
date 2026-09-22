import React, { useState, useEffect } from 'react';
import { getDefects } from '../services/defectData';
import { FaBug, FaSearch } from 'react-icons/fa';
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
    <div className="defect-log-page" id="defect-log-page" data-testid="defect-log-page">
      <div className="page-header" id="defect-log-header" data-testid="defect-log-header">
        <div>
          <h1 className="page-title" id="defect-log-title" data-testid="defect-log-title">Defect Log</h1>
          <p className="page-subtitle" id="defect-log-subtitle" data-testid="defect-log-subtitle">Track, monitor, and audit system defects and QA logs.</p>
        </div>
        <div className="header-stat-pill" id="total-defects-pill" data-testid="total-defects-pill">
          <FaBug className="bug-icon" /> Total Logged: <strong>{defects.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card filter-card" id="defect-filter-card" data-testid="defect-filter-card">
        <div className="search-input-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            id="search-defect-input"
            name="searchDefect"
            data-testid="search-defect-input"
            aria-label="Search Defects"
            className="form-input search-field"
            placeholder="Search defects by ID, title, module, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <label className="filter-label" htmlFor="severity-filter-select">Severity:</label>
            <select
              id="severity-filter-select"
              name="severityFilter"
              data-testid="severity-filter-select"
              aria-label="Filter by Severity"
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
            <label className="filter-label" htmlFor="priority-filter-select">Priority:</label>
            <select
              id="priority-filter-select"
              name="priorityFilter"
              data-testid="priority-filter-select"
              aria-label="Filter by Priority"
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
      <div className="card table-card" id="defect-table-card" data-testid="defect-table-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredDefects.length === 0 ? (
          <div className="empty-state-card" id="defect-empty-state" data-testid="defect-empty-state" style={{ padding: '3rem' }}>
            <div className="empty-icon-wrapper">
              <FaBug />
            </div>
            <h3>No Defect Records Found</h3>
            <p>No defects match your current search query or filter selection.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table defect-table" id="defect-table" data-testid="defect-table">
              <thead>
                <tr>
                  <th id="th-defect-id" data-testid="th-defect-id">Defect ID</th>
                  <th id="th-defect-title" data-testid="th-defect-title">Defect Title</th>
                  <th id="th-defect-module" data-testid="th-defect-module">Module</th>
                  <th id="th-defect-severity" data-testid="th-defect-severity">Severity</th>
                  <th id="th-defect-priority" data-testid="th-defect-priority">Priority</th>
                  <th id="th-defect-steps" data-testid="th-defect-steps">Steps to Reproduce</th>
                  <th id="th-defect-expected" data-testid="th-defect-expected">Expected Result</th>
                  <th id="th-defect-actual" data-testid="th-defect-actual">Actual Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredDefects.map((defect) => (
                  <tr key={defect.id} id={`row-defect-${defect.id}`} data-testid={`row-defect-${defect.id}`}>
                    <td id={`col-defect-id-${defect.id}`}>
                      <strong className="defect-id-badge">{defect.id}</strong>
                    </td>
                    <td id={`col-defect-title-${defect.id}`}>
                      <strong className="defect-title-text">{defect.title}</strong>
                    </td>
                    <td id={`col-defect-module-${defect.id}`}>
                      <span className="module-tag">{defect.module}</span>
                    </td>
                    <td id={`col-defect-severity-${defect.id}`}>
                      <span className={`severity-badge ${getSeverityBadgeClass(defect.severity)}`}>
                        {defect.severity}
                      </span>
                    </td>
                    <td id={`col-defect-priority-${defect.id}`}>
                      <span className="priority-badge">
                        {defect.priority}
                      </span>
                    </td>
                    <td id={`col-defect-steps-${defect.id}`}>
                      <div className="multiline-text steps-box">
                        {defect.stepsToReproduce}
                      </div>
                    </td>
                    <td id={`col-defect-expected-${defect.id}`}>
                      <div className="multiline-text expected-box">
                        {defect.expectedResult}
                      </div>
                    </td>
                    <td id={`col-defect-actual-${defect.id}`}>
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
