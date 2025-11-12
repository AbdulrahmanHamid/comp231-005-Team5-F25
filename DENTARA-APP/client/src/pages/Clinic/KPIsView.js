import React from "react";
import "../../styles/ClinicDashboard.css";

const KPIsView = () => {
  return (
    <div className="clinic-page">
      <h2>Clinic KPIs Dashboard</h2>
      <p>This section will display KPI charts and performance tiles.</p>

      <div className="clinic-cards">
        <div className="card">Total Appointments: 32</div>
        <div className="card">Checked-in: 28</div>
        <div className="card">Cancelled: 4</div>
      </div>

      <div className="chart-placeholder">
        📊 Chart.js integration will appear here.
      </div>
    </div>
  );
};

export default KPIsView;
