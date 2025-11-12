import React from "react";
import "../../styles/ClinicDashboard.css";

const ClinicHome = () => {
  return (
    <div>
      <div className="clinic-cards">
        <div className="card">Production</div>
        <div className="card">Collections</div>
      </div>

      <div className="clinic-content">
        <div className="schedule-box">
          <h3>
            TODAY’S SCHEDULE{" "}
            <span onClick={() => alert("Refreshing schedule...")} className="refresh">
              ⟳
            </span>
          </h3>
        </div>

        <div className="tasks-box">
          <h3>
            TASKS <span className="urgency">Urgency ↑↓</span>
          </h3>
          <ul className="task-list">
            <li><input type="checkbox" /> Check patient records</li>
            <li><input type="checkbox" /> Review missed check-ins</li>
            <li><input type="checkbox" /> Send reminders</li>
            <li><input type="checkbox" /> Update reports</li>
          </ul>
        </div>
      </div>

      <div className="alert-bar">⚠️ Missed Check-in</div>
    </div>
  );
};

export default ClinicHome;
