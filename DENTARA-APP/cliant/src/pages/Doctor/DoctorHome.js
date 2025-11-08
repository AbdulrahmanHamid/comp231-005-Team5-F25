import React from 'react';
import '../../styles/DoctorDashboard.css';

const DoctorHome = () => {
  return (
    <div className="doctor-home">
      {/* KPI Summary */}
      <section className="kpi-summary">
        <h3>Today's KPIs Summary</h3>
        <p>Completed: | Pending: | No-Shows:</p>
        <p>Total Appointments:</p>
      </section>

      <div className="middle-panels">
        {/* Schedule */}
        <section className="schedule">
          <h3>Today's Schedule</h3>
          <p>→ Table of appointments</p>
          <p>Time | Patient Name | Status | Action</p>
        </section>

        {/* Alerts */}
        <section className="alerts">
          <h3>Alerts & Urgent Cases</h3>
          <p>→ List of high-priority alerts</p>
          <div className="alert-actions">
            <button className="acknowledge-btn">Acknowledge</button>
            <button className="view-btn">View Patient</button>
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-buttons">
          <button className="action-btn">➕ Add Clinical Note</button>
          <button className="action-btn">📅 Schedule Treatment</button>
          <button className="action-btn">🗂️ View Follow-Ups</button>
        </div>
      </section>
    </div>
  );
};

export default DoctorHome;
