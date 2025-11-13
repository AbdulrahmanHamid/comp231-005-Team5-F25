
// export default ManageAppointments;
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [doctorsMap, setDoctorsMap] = useState({});

  // Filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const apptSnapshot = await getDocs(collection(db, "appointments"));
        const apptList = apptSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch doctor names
        const userSnapshot = await getDocs(collection(db, "users"));
        const docMap = {};

        userSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.role === "doctor") {
            const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
            docMap[doc.id] = fullName;
          }
        });

        setDoctorsMap(docMap);
        setAppointments(apptList);
        setFiltered(apptList); // default view

      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    };

    fetchData();
  }, []);

  // Combined Filter Logic
  useEffect(() => {
    let result = [...appointments];

    if (filterDate) {
      result = result.filter((a) => a.date === filterDate);
    }

    if (filterDoctor) {
      result = result.filter((a) => a.doctorId === filterDoctor);
    }

    if (filterStatus) {
      result = result.filter((a) => a.status === filterStatus);
    }

    setFiltered(result);
  }, [filterDate, filterDoctor, filterStatus, appointments]);

  return (
    <div className="tab-content">
      <div className="top-controls">
        <button className="green-btn">+ Add Appointment</button>

        {/* FILTERS */}
        <div className="filters">
          
          {/* DATE FILTER */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          {/* DOCTOR FILTER */}
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          >
            <option value="">All Doctors</option>
            {Object.entries(doctorsMap).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          {/* STATUS FILTER */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <table className="module-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length > 0 ? (
            filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.patientName}</td>
                <td>{doctorsMap[a.doctorId] || "Unknown Doctor"}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.reason}</td>
                <td>{a.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="load-btn">Load More</button>
    </div>
  );
};

export default ManageAppointments;
