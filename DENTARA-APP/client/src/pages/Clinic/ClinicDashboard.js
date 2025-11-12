import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { logout } = useAuth();
  const navigate = useNavigate(); // 👈 add this line


  return (
    <div className="clinic-layout">
      {/* Header */}
      <header className="clinic-header">
        <h1>CLINIC DASHBOARD</h1>
        <div className="clinic-header-buttons">
          <button className="kpi-btn" onClick={() => navigate("kpis")}>
            KPI Tiles
          </button>
          <button className="wrapup-btn active" onClick={() => navigate("home")}>
            Daily Wrap-Up
          </button> 
        </div>
      </header>


      <div className="clinic-body">
        {/* Sidebar */}
        <aside className="clinic-sidebar">
          <nav>
            <ul>
              <li>
                <NavLink to="home">
                  <FiHome /> Home
                </NavLink>
              </li>
              <li>
                <NavLink to="appointments">
                  <FiCalendar /> Appointments
                </NavLink>
              </li>
              <li>
                <NavLink to="tasks">
                  <FiClipboard /> Tasks
                </NavLink>
              </li>
              <li>
                <NavLink to="task-list">
                  <FiList /> Task List
                </NavLink>
              </li>
              <li>
                <NavLink to="appointment-centre">
                  <FiCalendar /> Appointment Centre
                </NavLink>
              </li>
              <li>
                <NavLink to="no-shows">
                  <FiList /> No-shows
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="logout-container">
            <button className="signout-btn" onClick={logout}>
              <FiLogOut className="logout-icon" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="clinic-main">
          {/* Nested routes will render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClinicDashboard;
