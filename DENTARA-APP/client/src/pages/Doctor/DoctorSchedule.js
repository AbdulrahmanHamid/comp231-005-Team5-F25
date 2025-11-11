import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/DoctorSchedule.css";

const DoctorSchedule = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, currentUser]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // Query appointments for selected date and current doctor
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('doctorId', '==', currentUser.uid),
        where('date', '==', selectedDate)
      );

      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by time
      appointmentsData.sort((a, b) => {
        const timeA = new Date(`1970-01-01 ${a.time}`);
        const timeB = new Date(`1970-01-01 ${b.time}`);
        return timeA - timeB;
      });

      setAppointments(appointmentsData);

      // Calculate stats
      const total = appointmentsData.length;
      const pending = appointmentsData.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length;
      const completed = appointmentsData.filter(a => a.status === 'Completed').length;
      const cancelled = appointmentsData.filter(a => a.status === 'Cancelled' || a.status === 'No-Show').length;

      setStats({ total, pending, completed, cancelled });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  const handleStartAppointment = async (appointmentId) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: 'In Progress'
      });
      // Refresh appointments
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: 'Completed'
      });
      // Refresh appointments
      fetchAppointments();
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  return (
    <div className="doctor-schedule-page">
      {/* Header */}
      <div className="schedule-header">
        <h2>Today's Schedule</h2>
        <span className="doctor-name">
          {currentUser ? `Dr. ${currentUser.email.split('@')[0]}` : "Dr. [Name]"}
        </span>
      </div>

      {/* Filter & Content */}
      <div className="schedule-container">
        {/* Date selector */}
        <div className="date-row">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-btn"
            style={{
              padding: '8px 15px',
              fontSize: '14px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#5bbf84',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Schedule panels */}
        <div className="schedule-panels">
          {/* Summary Column */}
          <div className="summary-box">
            <h3>Summary</h3>
            <ul>
              <li><strong>Total Appointments:</strong> {stats.total}</li>
              <li><strong>Pending:</strong> {stats.pending}</li>
              <li><strong>Completed:</strong> {stats.completed}</li>
              <li><strong>Cancelled / No-Shows:</strong> {stats.cancelled}</li>
            </ul>
          </div>

          {/* Appointment List */}
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
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: 
                            apt.status === 'Completed' ? '#d4edda' :
                            apt.status === 'Pending' ? '#fff3cd' :
                            apt.status === 'Confirmed' ? '#cfe2ff' :
                            apt.status === 'In Progress' ? '#cff4fc' :
                            '#f8d7da',
                          color: '#000'
                        }}>
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
                        ) : apt.status === 'Cancelled' ? (
                          <button className="table-btn">Reschedule</button>
                        ) : (
                          <button className="table-btn">View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-row">
          <h3>Quick Actions</h3>
          <button 
            className="action-btn"
            onClick={fetchAppointments}
          >
            🔄 Refresh
          </button>
          <button className="action-btn">🆕 Add Appointment</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
