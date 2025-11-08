import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; // 
import "../../styles/DoctorPatients.css";

const DoctorPatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  // Example static data — later this could be fetched from Firestore or API
  const patient = {
    id: patientId,
    name: "John Doe",
    age: 45,
    contact: "(416) 123-4567",
    condition: "Routine Check-up",
  };

  return (
    <div className="doctor-patient-page">
      <div className="page-header">
    
        <h2 className="page-title">Patient Details</h2>
      </div>

      <div className="patient-layout">
        {/* Left section */}
        <div className="patient-main">
          <section className="patient-card">
            <h3>Patient Information</h3>
            <div className="patient-info-content">
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Contact:</strong> {patient.contact}</p>
              <p><strong>Condition:</strong> {patient.condition}</p>
            </div>
          </section>

          <section className="patient-card">
            <h3>Visit & Treatment History</h3>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Treatment</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-11-05</td>
                  <td>Dr. Smith</td>
                  <td>Cleaning</td>
                  <td>Follow-up in 6 months</td>
                  <td>Completed</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="patient-card">
            <h3>Add / View Clinical Notes</h3>
            <textarea placeholder="Add your clinical notes..." rows="4" className="notes-area"></textarea>
            <button className="save-btn">Save Note</button>
          </section>
        </div>

        {/* Right section */}
        <aside className="quick-actions-box">
          <h3>Quick Actions</h3>
          <ul>
            <li><button className="quick-btn">📅 Schedule Next Visit</button></li>
            <li><button className="quick-btn">🔔 Send Reminder</button></li>
            <li><button className="quick-btn">💬 Message</button></li>
            <li><button className="quick-btn">📁 Upload Document</button></li>
          </ul>
          <button className="back-btn" onClick={() => navigate("/doctor-dashboard/patients")}>
          <FiArrowLeft className="back-icon" />
          Back to Patients List
        </button>
        </aside>
      </div>
    </div>
  );
};

export default DoctorPatientDetails;
