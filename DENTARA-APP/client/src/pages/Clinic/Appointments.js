import React from "react";
import "../../styles/ClinicDashboard.css";

const Appointments = () => {
  const appointments = [
    { id: 1, name: "John Doe", time: "10:00 AM", status: "Confirmed" },
    { id: 2, name: "Jane Smith", time: "11:30 AM", status: "Cancelled" },
    { id: 3, name: "Michael Lee", time: "1:00 PM", status: "Checked-in" },
  ];

  return (
    <div className="clinic-page">
      <h2>Appointments</h2>
      <p>View and manage patient appointments.</p>

      <table className="clinic-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.time}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
