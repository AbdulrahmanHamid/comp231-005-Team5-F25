import React, { useEffect, useState } from "react";
import "../../styles/ClinicDashboard.css";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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
  // 🔥 FETCH FROM FIREBASE
  // ============================
  const fetchNoShowData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "noShows"));

      const patientList = [];
      let total = 0;
      let rebooked = 0;
      let escalations = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        patientList.push(data);

        total += 1;
        if (data.status === "Rebooked") rebooked += 1;
        if (data.status === "Escalated") escalations += 1;
      });

      setStats({ total, rebooked, escalations });
      setPatients(patientList);

      // Trend Data Placeholder (replace later with weekly Firebase data)
      setTrendData([5, 8, 12, 9, 14, 10]);

    } catch (err) {
      console.error("Error fetching No-Show data:", err);
    }
  };

  useEffect(() => {
    fetchNoShowData();
  }, []);

  // =============================
  // 📊 CHART CONFIG
  // =============================
  const chartConfig = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "# No-shows",
        data: trendData,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const percentage =
    stats.total > 0 ? Math.round((stats.escalations / stats.total) * 100) : 0;

  return (
    <div className="clinic-dashboard-container">

      {/* Top Summary Bar */}
      <div className="dashboard-top-bar">
        <div className="date-box">
          <span className="calendar-icon">📅</span> Date
        </div>

        <div className="summary-box">Total No-shows: {stats.total}</div>
        <div className="summary-box">Rebooked: {stats.rebooked}</div>
      </div>

      {/* Two Main Tiles */}
      <div className="noshow-grid">
        
        {/* Left Stats Tile */}
        <div className="noshow-tile stats-tile">
          <h3>Total No-shows: {stats.total}</h3>
          <p>Escalations: {stats.escalations}</p>

          <div className="alert-circle">
            <div className="alert-inner">
              <span className="alert-icon">⚠️</span>
              <p>{percentage}%</p>
            </div>
          </div>
        </div>

        {/* Right Patient List Tile */}
        <div className="noshow-tile list-tile">
          <h3>Patient List</h3>
          <div className="patient-lines">
            {patients.map((p, index) => (
              <div className="patient-line" key={index}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="trend-tile">
        <h3>Weekly No-shows Trend</h3>

        <Line data={chartConfig} height={100} />
      </div>
    </div>
  );
};

export default NoShowList;
