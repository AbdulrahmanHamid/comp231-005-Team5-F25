import React from "react";
import "../../styles/ClinicDashboard.css";

const NoShowList = () => {
  const noShows = [
    { id: 1, name: "Liam Johnson", status: "Unreachable" },
    { id: 2, name: "Sophia Patel", status: "Rebooked" },
  ];

  return (
    <div className="clinic-page">
      <h2>No-Show List</h2>
      <p>Filter patients by rebooked or unreachable status.</p>

      <table className="clinic-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {noShows.map((n) => (
            <tr key={n.id}>
              <td>{n.name}</td>
              <td>{n.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="export-btn">Export Report</button>
    </div>
  );
};

export default NoShowList;
