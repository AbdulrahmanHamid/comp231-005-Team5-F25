import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientsByDoctor } from "../../../services/patientsService";
import { getDoctorInfo } from "../../../services/doctorService";
import "../../../styles/ClinicDashboard.css";

const DoctorPatients = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [doctorId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch doctor info
      const doctorInfo = await getDoctorInfo(doctorId);
      setDoctor(doctorInfo);

      // Fetch patients
      const patientsList = await getPatientsByDoctor(doctorId);
      setPatients(patientsList);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="clinic-content-box"><p>Loading...</p></div>;
  }

  return (
    <div className="clinic-content-box">
      <div className="clinic-page-header">
        <button
          className="clinic-btn-back"
          onClick={() => navigate("/staff-dashboard/patients")}
        >
          ← Back to Doctors
        </button>
        <h2>{doctor ? doctor.fullName : "Doctor"}'s Patients</h2>
      </div>

      {patients.length === 0 ? (
        <p>No patients found for this doctor</p>
      ) : (
        <table className="clinic-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Condition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.firstName} {patient.lastName}</td>
                <td>{patient.age}</td>
                <td>{patient.phone}</td>
                <td>{patient.condition}</td>
                <td>
                  <button
                    className="clinic-btn-small"
                    onClick={() => navigate(`/staff-dashboard/patients/details/${patient.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorPatients;
