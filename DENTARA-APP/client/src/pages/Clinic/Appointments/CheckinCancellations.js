
// export default CheckinCancellations;
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

const CheckinCancellations = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorsMap, setDoctorsMap] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    checkedIn: 0,
    cancelled: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // -------------------------
        // Load appointments
        // -------------------------
        const apptSnap = await getDocs(collection(db, "appointments"));
        const apptList = apptSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // -------------------------
        // Load doctors
        // -------------------------
        const doctorSnap = await getDocs(collection(db, "users"));
        const map = {};

        doctorSnap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.role === "doctor") {
            map[doc.id] = `${data.firstName || ""} ${data.lastName || ""}`.trim();
          }
        });

        setDoctorsMap(map);
        setAppointments(apptList);

        // -------------------------
        // Compute Stats
        // -------------------------
        const total = apptList.length;
        const checkedIn = apptList.filter((a) => a.status === "Checked-in").length;
        const cancelled = apptList.filter((a) => a.status === "Cancelled").length;
        const pending = apptList.filter((a) => a.status === "Pending").length;

        setStats({ total, checkedIn, cancelled, pending });

      } catch (error) {
        console.error("Error loading Checkin/Cancellations:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="tab-content">

      {/* Filters Panel */}
      <div className="filters">
        <select><option>Filter by Date</option></select>
        <select><option>Doctor</option></select>
        <select><option>Status</option></select>
      </div>


      <div className="checkin-layout">

        {/* Table Area */}
        <div className="table-area">
          <table className="module-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.patientName || a.patientId}</td>
                  <td>{doctorsMap[a.doctorId] || "Unknown Doctor"}</td>
                  <td>{a.time}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="load-btn">Load More</button>
        </div>


        {/* Stats Box */}
        <div className="stats-box">
          <h3>QUICK STATS</h3>
          <p>Total Appointments: {stats.total}</p>
          <p>Checked-in: {stats.checkedIn}</p>
          <p>Cancelled: {stats.cancelled}</p>
          <p>Pending: {stats.pending}</p>

          <div className="fake-chart"></div>
        </div>
      </div>
    </div>
  );
};

export default CheckinCancellations;
