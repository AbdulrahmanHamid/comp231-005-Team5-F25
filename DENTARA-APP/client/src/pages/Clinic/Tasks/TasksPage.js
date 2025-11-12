import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../../styles/ClinicDashboard.css";

const TasksPage = () => {
  return (
    <div>
      <h2>Tasks</h2>

      {/* Simple Nav Buttons */}
      <div className="subnav-buttons">
        <NavLink to="summary" className="subnav-btn">
          Task Summary
        </NavLink>

        <NavLink to="list" className="subnav-btn">
          Task List
        </NavLink>
      </div>

      {/* Render nested pages */}
      <Outlet />
    </div>
  );
};

export default TasksPage;
