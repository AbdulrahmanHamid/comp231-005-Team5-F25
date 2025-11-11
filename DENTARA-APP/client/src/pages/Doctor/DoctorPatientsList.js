import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "../../styles/DoctorDashboard.css";
import "../../styles/DoctorPatients.css";

const DoctorPatientsList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const patientsQuery = query(collection(db, 'patients'), orderBy('lastName'));
      const patientsSnapshot = await getDocs(patientsQuery);
      const patientsData = patientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="doctor-patient-list"><p>Loading patients...</p></div>;
  }

  return (
    <div className="doctor-patient-list">
      <h2 className="page-title">Patients</h2>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 15px',
            width: '100%',
            maxWidth: '400px',
            fontSize: '16px',
            border: '2px solid #78d494',
            borderRadius: '8px',
            outline: 'none'
          }}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <p>No patients found</p>
      ) : (
        <table className="history-table">
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
            {filteredPatients.map((p) => (
              <tr key={p.id}>
                <td>{p.firstName} {p.lastName}</td>
                <td>{p.age}</td>
                <td>{p.phone}</td>
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
      )}
    </div>
  );
};

export default DoctorPatientsList;
