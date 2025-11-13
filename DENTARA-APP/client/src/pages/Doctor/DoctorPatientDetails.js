import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiArrowLeft } from "react-icons/fi";
import { getPatientById, getPatientTreatments, getPatientClinicalNotes, addClinicalNote, getDoctorInfo } from "../../services/doctorService";
import "../../styles/DoctorPatients.css";

const DoctorPatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [patient, setPatient] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    fetchPatientData();
    fetchDoctorName();
  }, [patientId]);

  const fetchDoctorName = async () => {
    try {
      const info = await getDoctorInfo(currentUser.uid);
      if (info) setDoctorName(info.fullName);
    } catch (error) {
      console.error('Error fetching doctor name:', error);
    }
  };

  const fetchPatientData = async () => {
    try {
      setLoading(true);

      // for patient details
      const patientData = await getPatientById(patientId);
      setPatient(patientData);

      // for treatment history
      const treatmentsData = await getPatientTreatments(patientId);
      setTreatments(treatmentsData);

      // for clinical notes
      const notesData = await getPatientClinicalNotes(patientId);
      setClinicalNotes(notesData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setLoading(false);
    }
  };


  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      alert('Please enter a note');
      return;
    }

    try {
      setSaving(true);

      await addClinicalNote(
        patientId,
        `${patient.firstName} ${patient.lastName}`,
        doctorName || `Dr. ${currentUser.email.split('@')[0]}`,
        newNote
      );

      alert('Note saved successfully!');
      setNewNote('');
      fetchPatientData(); // Refresh data to show new note
      setSaving(false);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
      setSaving(false);
    }
  };

  const handleScheduleNextVisit = () => {
    // Navigate to schedule page
    navigate('/doctor-dashboard/schedule');
  };

  if (loading) {
    return <div className="doctor-patient-page"><p>Loading patient details...</p></div>;
  }

  if (!patient) {
    return <div className="doctor-patient-page"><p>Patient not found</p></div>;
  }

  return (
    <div className="doctor-patient-page">
      <div className="page-header">
        <h2 className="page-title">Patient Details</h2>
      </div>

      <div className="patient-layout">
        <div className="patient-main">
          <section className="patient-card">
            <h3>Patient Information</h3>
            <div className="patient-info-content">
              <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Phone:</strong> {patient.phone}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Condition:</strong> {patient.condition}</p>
            </div>
          </section>

          <section className="patient-card">
            <h3>Visit & Treatment History</h3>
            {treatments.length === 0 ? (
              <p>No treatment history available</p>
            ) : (
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
                  {treatments.map(treatment => (
                    <tr key={treatment.id}>
                      <td>{treatment.date}</td>
                      <td>{treatment.doctor}</td>
                      <td>{treatment.treatment}</td>
                      <td>{treatment.notes}</td>
                      <td>{treatment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="patient-card">
            <h3>Add Clinical Note</h3>
            <textarea
              placeholder="Add your clinical notes..."
              rows="4"
              className="notes-area"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              disabled={saving}
            ></textarea>
            <button
              className="save-btn"
              onClick={handleSaveNote}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Note'}
            </button>
          </section>

          <section className="patient-card">
            <h3>Clinical Notes History</h3>
            {clinicalNotes.length === 0 ? (
              <p>No clinical notes yet</p>
            ) : (
              <div className="notes-history">
                {clinicalNotes.map(note => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <strong>{note.date}</strong> - {note.doctor}
                    </div>
                    <div className="note-content">
                      {note.notes}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="quick-actions-box">
          <h3>Quick Actions</h3>
          <ul>
            <li>
              <button
                className="quick-btn"
                onClick={handleScheduleNextVisit}
              >
                📅 Schedule Next Visit
              </button>
            </li>
          </ul>
          <button
            className="back-btn"
            onClick={() => navigate("/doctor-dashboard/patients")}
          >
            <FiArrowLeft className="back-icon" />
            Back to Patients List
          </button>
        </aside>
      </div>
    </div>
  );
};

export default DoctorPatientDetails;
