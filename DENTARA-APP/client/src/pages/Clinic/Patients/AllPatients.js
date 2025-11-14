import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listenToAllPatients, addNewPatient, updatePatient } from "../../../services/patientsService";
import { listenToDoctors } from "../../../services/usersService";
import "../../../styles/ClinicDashboard.css";

const AllPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "",
    condition: "",
    doctorId: "",
    doctorName: "",
  });

  useEffect(() => {
    // Listen to patients
    const unsubscribePatients = listenToAllPatients((patientsList) => {
      patientsList.sort((a, b) => {
        const lastNameA = (a.lastName || "").toLowerCase();
        const lastNameB = (b.lastName || "").toLowerCase();
        return lastNameA.localeCompare(lastNameB);
      });
      setPatients(patientsList);
      setLoading(false);
    });

    // Listen to doctors
    const unsubscribeDoctors = listenToDoctors((doctorsList) => {
      setDoctors(doctorsList);
    });

    return () => {
      unsubscribePatients();
      unsubscribeDoctors();
    };
  }, []);

  const handleAddNew = () => {
    setSelectedPatient(null);
    setFormData({
      firstName: "",
      lastName: "",
      age: "",
      phone: "",
      email: "",
      condition: "",
      doctorId: "",
      doctorName: "",
    });
    setShowForm(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      age: patient.age || "",
      phone: patient.phone || "",
      email: patient.email || "",
      condition: patient.condition || "",
      doctorId: patient.doctorId || "",
      doctorName: patient.doctorName || "",
    });
    setShowForm(true);
  };

  const handleDoctorChange = (doctorId) => {
    const selectedDoctor = doctors.find((d) => d.id === doctorId);
    setFormData({
      ...formData,
      doctorId: doctorId,
      doctorName: selectedDoctor ? selectedDoctor.fullName : "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.doctorId) {
      alert("Please fill in all required fields (First Name, Last Name, Phone, Doctor)");
      return;
    }

    try {
      if (selectedPatient) {
        // Update existing
        await updatePatient(selectedPatient.id, {
          ...formData,
          age: parseInt(formData.age) || 0,
        });
        alert("Patient updated successfully!");
      } else {
        // Add new
        await addNewPatient({
          ...formData,
          age: parseInt(formData.age) || 0,
        });
        alert("Patient added successfully!");
      }

      setShowForm(false);
      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        phone: "",
        email: "",
        condition: "",
        doctorId: "",
        doctorName: "",
      });
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Failed to save patient");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="clinic-content-box">
        <p>Loading patients...</p>
      </div>
    );
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
        <h2>📋 All Patients</h2>
      </div>

      <div className="search-add-bar">
        <input
          type="text"
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="clinic-search-input"
        />
        <button onClick={handleAddNew} className="clinic-btn-primary">
          ➕ Add New Patient
        </button>
      </div>

      {/* Patients Table */}
      <table className="clinic-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Primary Doctor</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td>
                {patient.firstName} {patient.lastName}
              </td>
              <td>{patient.age}</td>
              <td>{patient.phone}</td>
              <td>{patient.doctorName || "Not Assigned"}</td>
              <td>{patient.condition}</td>
              <td>
                <button
                  className="clinic-btn-small"
                  onClick={() => handleEdit(patient)}
                  style={{ marginRight: "5px" }}
                >
                  Manage
                </button>
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

      {/* Add/Edit Form */}
      {showForm && (
        <div className="manage-box">
          <div className="manage-header">
            <h3>{selectedPatient ? "✏️ Edit Patient" : "➕ Add New Patient"}</h3>
            <button className="close-btn" onClick={() => setShowForm(false)}>
              ✖
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="manage-form">
              <input
                type="text"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />

              <input
                type="tel"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <select
                value={formData.doctorId}
                onChange={(e) => handleDoctorChange(e.target.value)}
                required
              >
                <option value="">Select Primary Doctor *</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Condition (e.g., Routine Check-up)"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              />
            </div>

            <div className="manage-actions">
              <button type="submit" className="save-btn">
                💾 {selectedPatient ? "Save Changes" : "Add Patient"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AllPatients;
