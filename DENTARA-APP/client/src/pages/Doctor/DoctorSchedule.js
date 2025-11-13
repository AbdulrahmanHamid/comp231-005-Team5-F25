import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {listenToDoctorAppointments,updateAppointmentStatus,addDoctorAppointment,getAllPatients,getDoctorInfo} from "../../services/doctorService";
import { getTodayLocal } from "../../utils/dateUtils";
import "../../styles/DoctorSchedule.css";

const DoctorSchedule = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: '',
    time: '',
    reason: '',
    room: ''
  });

  useEffect(() => {
    if (!currentUser) return;

    //  doctor info
    getDoctorInfo(currentUser.uid).then((info) => {
      if (info) setDoctorName(info.fullName);
    });

    // all patients
    getAllPatients().then((patientsList) => {
      setPatients(patientsList);
    });

    // Listen to appointments for selected date
    const unsubscribe = listenToDoctorAppointments(
      currentUser.uid,
      selectedDate,
      (appointmentsList) => {
        setAppointments(appointmentsList);

        // Calculate stats
        const total = appointmentsList.length;
        const pending = appointmentsList.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length;
        const completed = appointmentsList.filter(a => a.status === 'Completed').length;
        const cancelled = appointmentsList.filter(a => a.status === 'Cancelled' || a.status === 'No-Show').length;

        setStats({ total, pending, completed, cancelled });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, selectedDate]);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.time || !formData.reason) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const selectedPatient = patients.find(p => p.id === formData.patientId);
      
      await addDoctorAppointment({
        patientId: formData.patientId,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        doctorId: currentUser.uid,
        date: selectedDate,
        time: formData.time,
        reason: formData.reason,
        room: formData.room || 'TBD',
      });

      alert('Appointment added successfully!');
      setShowAddForm(false);
      setFormData({ patientId: '', time: '', reason: '', room: '' });
    } catch (error) {
      console.error('Error adding appointment:', error);
      alert('Failed to add appointment');
    }
  };

  const handleStartAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'In Progress');
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'Completed');
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor-dashboard/patients/${patientId}`);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'status-badge status-completed';
      case 'Pending': return 'status-badge status-pending';
      case 'Confirmed': return 'status-badge status-confirmed';
      case 'In Progress': return 'status-badge status-in-progress';
      default: return 'status-badge status-cancelled';
    }
  };

  return (
    <div className="doctor-schedule-page">
      <div className="schedule-header">
        <h2>Today's Schedule</h2>
        <span className="doctor-name">
          {doctorName || "Loading..."}
        </span>
      </div>

      <div className="schedule-container">
        <div className="date-row">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-btn"
          />
        </div>

        <div className="schedule-panels">
          <div className="summary-box">
            <h3>Summary</h3>
            <ul>
              <li><strong>Total Appointments:</strong> {stats.total}</li>
              <li><strong>Pending:</strong> {stats.pending}</li>
              <li><strong>Completed:</strong> {stats.completed}</li>
              <li><strong>Cancelled / No-Shows:</strong> {stats.cancelled}</li>
            </ul>
          </div>

          <div className="appointments-box">
            <h3>Appointments List</h3>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p>No appointments for this date</p>
            ) : (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Reason</th>
                    <th>Room</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>{apt.time}</td>
                      <td>{apt.patientName}</td>
                      <td>{apt.reason}</td>
                      <td>{apt.room}</td>
                      <td>
                        <span className={getStatusClass(apt.status)}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        {apt.status === 'Pending' || apt.status === 'Confirmed' ? (
                          <button 
                            className="table-btn"
                            onClick={() => handleStartAppointment(apt.id)}
                          >
                            Start
                          </button>
                        ) : apt.status === 'In Progress' ? (
                          <button 
                            className="table-btn"
                            onClick={() => handleCompleteAppointment(apt.id)}
                          >
                            Complete
                          </button>
                        ) : (
                          <button 
                            className="table-btn"
                            onClick={() => handleViewPatient(apt.patientId)}
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="action-row">
          <h3>Quick Actions</h3>
          <button className="action-btn" onClick={() => setSelectedDate(getTodayLocal())}>
            🔄 Refresh
          </button>
          <button className="action-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '❌ Cancel' : '🆕 Add Appointment'}
          </button>
        </div>

        {showAddForm && (
          <div className="appointment-form-container">
            <h3>Add New Appointment</h3>
            <form onSubmit={handleAddAppointment}>
              <div className="form-field">
                <label>Patient *</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>

              <div className="form-field">
                <label>Reason for Visit *</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  required
                  placeholder="e.g., Cleaning, Filling, Consultation"
                />
              </div>

              <div className="form-field">
                <label>Room</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  placeholder="e.g., Room 1"
                />
              </div>

              <button type="submit" className="submit-btn">
                Add Appointment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedule;
