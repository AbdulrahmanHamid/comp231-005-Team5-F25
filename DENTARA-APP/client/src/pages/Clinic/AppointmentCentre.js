import React from "react";
import "../../styles/ClinicDashboard.css";

const AppointmentCentre = () => {
  return (
    <div className="clinic-page">
      <h2>Appointment Centre</h2>
      <p>Manage patient check-ins, cancellations, and daily schedules.</p>

      <div className="clinic-table-container">
        <table className="clinic-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alex Carter</td>
              <td>9:00 AM</td>
              <td>Scheduled</td>
              <td><button>Check-In</button> <button>Cancel</button></td>
            </tr>
            <tr>
              <td>Emma Brown</td>
              <td>10:15 AM</td>
              <td>Checked-in</td>
              <td><button disabled>Done</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentCentre;
