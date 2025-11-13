import React, { useEffect, useState } from "react";
import { listenToAllAppointments } from "../../../services/appointmentsService";
import { listenToDoctors } from "../../../services/usersService";
import ManageAppointments from "./ManageAppointments";
import "../../../styles/ClinicDashboard.css";

const formatDate = () => new Date().toISOString().split("T")[0];

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Load doctors
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const unsub = listenToDoctors((list) => setDoctors(list));
    return () => unsub();
  }, []);

  // Load appointments
  useEffect(() => {
    const unsub = listenToAllAppointments((list) => {
      const safeList = list.map((a) => {
        const doctor = doctors.find((d) => d.id === a.doctorId);
        return {
          ...a,
          doctorName: doctor ? doctor.fullName : "Unknown",
        };
      });

      // sort by date + time
      safeList.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        if (a.date === b.date) {
          if (a.time && b.time) return a.time.localeCompare(b.time);
          return 0;
        }
        return a.date.localeCompare(b.date);
      });

      setAppointments(safeList);
      setFiltered(safeList);
    });

    return () => unsub();
  }, [doctors]);

  // Search & Filters
  useEffect(() => {
    let result = [...appointments];
    const today = formatDate();

    if (search.trim() !== "") {
      result = result.filter((a) =>
        `${a.patientName} ${a.doctorName} ${a.reason}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (dateFilter === "today") {
      result = result.filter((a) => a.date === today);
    } else if (dateFilter === "upcoming") {
      result = result.filter((a) => a.date > today);
    }

    setFiltered(result);
    setSelectedAppointment(result[0] || null);
  }, [search, statusFilter, dateFilter, appointments]);

  const statusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return "status completed";
      case "checked-in":
        return "status checkedin";
      case "cancelled":
        return "status cancelled";
      case "no-show":
        return "status noshow";
      default:
        return "status pending";
    }
  };

  return (
    <div className="appointment-page">
      <h2>Appointments</h2>

      {/* Filters */}
      <div className="appoint-filters">
        <input
          type="text"
          placeholder="Search patient, doctor or reason..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="checked-in">Checked-In</option>
          <option value="Completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-Show</option>
        </select>

        <select
          className="filter-select"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      <button className="add-btn" onClick={() => setSelectedAppointment(null)}>
        ➕ Add New Appointment
      </button>

      {/* Table */}
      {filtered.length === 0 ? (
        <p>No appointments match your filters.</p>
      ) : (
        <table className="clinic-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.patientName}</td>
                <td>{a.doctorName}</td>
                <td>{a.reason}</td>
                <td>
                  <span className={statusClass(a.status)}>{a.status}</span>
                </td>
                <td>
                  <button
                    className="manage-btn"
                    onClick={() => setSelectedAppointment(a)}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Manage Panel */}
      <div style={{ marginTop: "20px" }}>
        <ManageAppointments
          appointment={selectedAppointment}
          doctors={doctors}
        />
      </div>
    </div>
  );
};

export default AppointmentsPage;
