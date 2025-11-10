import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // ✅ Add this
import {
  FiHome,
  FiClipboard,
  FiPhoneCall,
  FiLogOut,
  FiList,
  FiCalendar,
} from "react-icons/fi";
import "../../styles/ClinicDashboard.css";

const ClinicDashboard = () => {
  const { logout } = useAuth(); // ✅ Same as DoctorDashboard

  return (
    <div className="clinic-layout">
      {/* Header */}
      <header className="clinic-header">
        <h1>CLINIC DASHBOARD</h1>
        <div className="clinic-header-buttons">
          <button className="kpi-btn">KPI Tiles</button>
          <button className="wrapup-btn active">Daily Wrap-Up</button>
        </div>
      </header>

      <div className="clinic-body">
        {/* Sidebar */}
        <aside className="clinic-sidebar">
          <nav>
            <ul>
              <li>
                <NavLink to="/clinic-dashboard/home">
                  <FiHome /> Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/clinic-dashboard/appointments">
                  <FiCalendar /> Appointments
                </NavLink>
              </li>
              <li>
                <NavLink to="/clinic-dashboard/tasks">
                  <FiClipboard /> Tasks
                </NavLink>
              </li>
              <li>
                <NavLink to="/clinic-dashboard/recalls">
                  <FiList /> Recalls
                </NavLink>
              </li>
              <li>
                <NavLink to="/clinic-dashboard/no-shows">
                  <FiList /> No-shows
                </NavLink>
              </li>
              <li>
                <NavLink to="/clinic-dashboard/messages">
                  <FiPhoneCall /> Call & Message
                </NavLink>
              </li>
              <li>
                <NavLink to="/clinic-dashboard/schedule">
                  <FiCalendar /> Schedule
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* ✅ Logout button uses same logic */}
          <div className="logout-container">
            <button className="signout-btn" onClick={logout}>
              <FiLogOut className="logout-icon" />
              Sign Out
            </button>
          </div>

        </aside>

        {/* Main Content */}
        <main className="clinic-main">
          <div className="clinic-cards">
            <div className="card">Production</div>
            <div className="card">Collections</div>
          </div>

          <div className="clinic-content">
            <div className="schedule-box">
              <h3>
                TODAY’S SCHEDULE{" "}
                <span
                  onClick={() => alert("Refreshing schedule...")}
                  className="refresh"
                >
                  ⟳
                </span>
              </h3>
            </div>

            <div className="tasks-box">
              <h3>
                TASKS <span className="urgency">Urgency ↑↓</span>
              </h3>
              <ul className="task-list">
                <li>
                  <input type="checkbox" /> Check patient records
                </li>
                <li>
                  <input type="checkbox" /> Review missed check-ins
                </li>
                <li>
                  <input type="checkbox" /> Send reminders
                </li>
                <li>
                  <input type="checkbox" /> Update reports
                </li>
              </ul>
            </div>
          </div>

          <div className="alert-bar">⚠️ Missed Check-in</div>
        </main>
      </div>
    </div>
  );
};

export default ClinicDashboard;
