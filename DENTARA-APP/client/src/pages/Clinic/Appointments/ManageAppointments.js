import React from "react";

const ManageAppointments = () => {
  // Sample dummy data (replace easily with Firebase later)
  const appointments = new Array(8).fill(null).map((_, i) => ({
    id: i,
    patient: "Patient " + (i + 1),
    doctor: "Dr. Smith",
    date: "2025-03-10",
    time: "10:00 AM",
    service: "Consultation",
    status: "Scheduled",
  }));

  return (
    <div className="tab-content">
      <div className="top-controls">
        <button className="green-btn">+ Add Appointment</button>

        <div className="filters">
          <select><option>Filter by Date</option></select>
          <select><option>Doctor</option></select>
          <select><option>Status</option></select>
        </div>
      </div>

      <table className="module-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Service</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.patient}</td>
              <td>{a.doctor}</td>
              <td>{a.date}</td>
              <td>{a.time}</td>
              <td>{a.service}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="load-btn">Load More</button>
    </div>
  );
};

export default ManageAppointments;
