import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "../../styles/DoctorDashboard.css";
import "../../styles/DoctorPatients.css";

const DoctorPatientsList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    email: '',
    condition: ''
  });

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

  const handleAddPatient = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert('Please fill in required fields (First Name, Last Name, Phone)');
      return;
    }

    try {
      await addDoc(collection(db, 'patients'), {
        ...formData,
        age: parseInt(formData.age) || 0,
        createdAt: new Date().toISOString()
      });

      alert('Patient added successfully!');
      setShowAddForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        phone: '',
        email: '',
        condition: ''
      });
      fetchPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient');
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

      <div className="search-action-bar">
        <input
          type="text"
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-patient-btn"
        >
          {showAddForm ? '❌ Cancel' : '➕ Add New Patient'}
        </button>
      </div>

      {showAddForm && (
        <div className="patient-form-container">
          <h3>Add New Patient</h3>
          <form onSubmit={handleAddPatient}>
            <div className="form-grid">
              <div className="form-field">
                <label>First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>

              <div className="form-field">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>

              <div className="form-field">
                <label>Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>

              <div className="form-field">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-field">
                <label>Condition</label>
                <input
                  type="text"
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  placeholder="e.g., Routine Check-up"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Add Patient
            </button>
          </form>
        </div>
      )}

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
