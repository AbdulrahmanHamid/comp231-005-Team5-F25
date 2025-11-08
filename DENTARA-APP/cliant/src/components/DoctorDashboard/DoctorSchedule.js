import React from "react";
import "../../styles/DoctorSchedule.css";
import { useAuth } from "../../contexts/AuthContext";

const DoctorSchedule = () => {
  const { currentUser } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="doctor-schedule-page">
      {/* Header */}
      <div className="schedule-header">
        <h2>Today's Schedule</h2>
        <span className="doctor-name">
          {currentUser ? `Dr. ${currentUser.email}` : "Dr. [Name]"}
        </span>
      </div>

      {/* Filter & Content */}
      <div className="schedule-container">
        {/* Date selector */}
        <div className="date-row">
          <button className="date-btn">
            {today} ▼
          </button>
        </div>

        {/* Schedule panels */}
        <div className="schedule-panels">
          {/* Summary Column */}
          <div className="summary-box">
            <h3>Summary Row</h3>
            <ul>
              <li>Total Appointments: 8</li>
              <li>Pending: 3</li>
              <li>Completed: 4</li>
              <li>Cancelled / No-Shows: 1</li>
            </ul>
          </div>

          {/* Appointment List */}
          <div className="appointments-box">
            <h3>Appointments List</h3>
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>09:00 AM</td>
                  <td>John Doe</td>
                  <td>Cleaning</td>
                  <td>Completed</td>
                  <td><button className="table-btn">View</button></td>
                </tr>
                <tr>
                  <td>10:30 AM</td>
                  <td>Jane Smith</td>
                  <td>Filling</td>
                  <td>Pending</td>
                  <td><button className="table-btn">Start</button></td>
                </tr>
                <tr>
                  <td>12:00 PM</td>
                  <td>Tom Wilson</td>
                  <td>Consultation</td>
                  <td>Cancelled</td>
                  <td><button className="table-btn">Reschedule</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-row">
          <h3>Action Button</h3>
          <button className="action-btn">🆕 Add Appointment</button>
          <button className="action-btn">🔄 Refresh</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
