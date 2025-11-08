import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/DoctorDashboard.css";
import "../../styles/DoctorPatients.css";


const DoctorPatientsList = () => {
  const navigate = useNavigate();

  const patients = [
    { id: 1, name: "John Doe", age: 45, condition: "Routine Check-up" },
    { id: 2, name: "Jane Smith", age: 38, condition: "Dental Filling" },
    { id: 3, name: "Mark Lee", age: 50, condition: "Root Canal" },
  ];

  return (
    <div className="doctor-patient-list">
      <h2 className="page-title">Patients</h2>

      <table className="history-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.condition}</td>
              <td>
                <button
  className="table-btn"
  onClick={() => navigate(`/doctor-dashboard/patients/${p.id}`)}
>
  View
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorPatientsList;
