import React, { useEffect, useState } from "react";
import "../../styles/ClinicDashboard.css";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler);

const NoShowList = () => {
  const db = getFirestore();

  const [stats, setStats] = useState({
    total: 0,
    rebooked: 0,
    escalations: 0,
  });

  const [patients, setPatients] = useState([]);
  const [trendData, setTrendData] = useState([]);

  // ============================
  // 🔥 REAL-TIME FETCH FROM APPOINTMENTS
  // ============================
  useEffect(() => {
  const unsub = onSnapshot(collection(db, "appointments"), (snapshot) => {

    const patientList = [];
    let total = 0;
    let rebooked = 0;      // we will keep 0 because DB does not store this yet
    let escalations = 0;   // same

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.status.toLowerCase() === "no-show") {
        total++;

        patientList.push({
          name: data.patientName || "Unknown",
          date: data.date || "",
          time: data.time || "",
          reason: data.reason || "",
          doctorId: data.doctorId || "",
        });
      }
    });

    setStats({ total, rebooked, escalations });
    setPatients(patientList);

    // simple demo trend
    setTrendData([1,2,3, total, 2,1]);
  });

  return () => unsub();
}, []);


  // =============================
  // 📊 CHART CONFIG
  // =============================
  const chartConfig = {
    labels: ["W1", "W2", "W3", "W4", "W5", "Now"],
    datasets: [
      {
        label: "No-shows",
        data: trendData,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const percentage =
    stats.total > 0 ? Math.round((stats.escalations / stats.total) * 100) : 0;

  return (
  <div className="noshow-page">

    {/* 🔵 TOP SUMMARY CARDS */}
    <div className="noshow-summary-row">
      <div className="summary-card">
        <h4>Total No-shows</h4>
        <p className="big-number">{stats.total}</p>
      </div>

      <div className="summary-card">
        <h4>Rebooked</h4>
        <p className="big-number">{stats.rebooked}</p>
      </div>

      <div className="summary-card">
        <h4>Escalations</h4>
        <div className="circle-box">
          <span className="circle-number">{percentage}%</span>
        </div>
      </div>
    </div>

    {/* 🔵 MIDDLE GRID */}
    <div className="noshow-middle-row">
      
      {/* Patient List */}
      <div className="noshow-card">
        <h3>No-show Patients</h3>

        <div className="patient-list">
          {patients.length === 0 && <p>No records</p>}

          {patients.map((p, i) => (
            <div className="patient-item" key={i}>
              <strong>{p.patientName}</strong>
              <span>{p.date} • {p.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reason Breakdown */}
      <div className="noshow-card">
        <h3>Reasons Breakdown</h3>

        <div className="breakdown">
          <p>Cleaning: {patients.filter(p => p.reason?.toLowerCase().includes("clean")).length}</p>
          <p>Consult: {patients.filter(p => p.reason?.toLowerCase().includes("consult")).length}</p>
          <p>Other: {patients.length - patients.filter(p => p.reason).length}</p>
        </div>
      </div>

    </div>

    {/* 🔵 TREND CHART */}
    <div className="noshow-chart-card">
      <h3>Weekly No-shows Trend</h3>
      <Line data={chartConfig} height={120} />
    </div>

  </div>
);
};

export default NoShowList;
