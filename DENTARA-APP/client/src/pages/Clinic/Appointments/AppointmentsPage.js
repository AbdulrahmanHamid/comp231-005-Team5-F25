import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../../styles/ClinicDashboard.css";

const AppointmentsPage = () => {
  return (
    <div>
      <h2>Appointments</h2>

      {/* Simple Nav Buttons */}
      <div className="subnav-buttons">
        <NavLink to="manage" className="subnav-btn">
          Manage Appointments
        </NavLink>

        <NavLink to="checkin" className="subnav-btn">
          Check-in / Cancellations
        </NavLink>
      </div>

      {/* Render nested pages */}
      <Outlet />
    </div>
  );
};

export default AppointmentsPage;
