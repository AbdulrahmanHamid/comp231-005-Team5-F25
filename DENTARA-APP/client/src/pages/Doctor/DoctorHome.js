import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { getTodayLocal } from '../../utils/dateUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/DoctorDashboard.css';

const DoctorHome = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    noShows: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  const today = getTodayLocal();

  useEffect(() => {
    fetchDashboardData();
    fetchDoctorName();
  }, [currentUser]);
  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);


  const fetchDoctorName = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setDoctorName(`Dr. ${userData.firstName} ${userData.lastName}`);
      }
    } catch (error) {
      console.error('Error fetching doctor name:', error);
    }
  };



  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('doctorId', '==', currentUser.uid),
        where('date', '==', today)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAppointments(appointmentsData);

      const completed = appointmentsData.filter(a => a.status === 'Completed').length;
      const pending = appointmentsData.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length;
      const noShows = appointmentsData.filter(a => a.status === 'Cancelled' || a.status === 'No-Show').length;

      setStats({
        completed,
        pending,
        noShows,
        total: appointmentsData.length
      });

      const alertsQuery = query(
        collection(db, 'alerts'),
        where('doctorId', '==', currentUser.uid),
        where('isAcknowledged', '==', false)
      );
      const alertsSnapshot = await getDocs(alertsQuery);
      const alertsData = alertsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAlerts(alertsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };


  const handleAcknowledgeAlert = async (alertId) => {
    try {
      const alertRef = doc(db, 'alerts', alertId);
      await updateDoc(alertRef, {
        isAcknowledged: true
      });
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor-dashboard/patients/${patientId}`);
  };

  const handleAddClinicalNote = () => {
    navigate('/doctor-dashboard/patients');
    alert('Please select a patient to add a clinical note');
  };

  const handleScheduleTreatment = () => {
    navigate('/doctor-dashboard/schedule');
    alert('Use the "Add Appointment" button to schedule a treatment');
  };

  const handleViewFollowUps = () => {
    alert('Follow-ups feature: This will show all patients needing follow-up visits');
  };

  if (loading) {
    return <div className="doctor-home"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="doctor-home">
      <section className="kpi-summary">
        <h3>Today's KPIs Summary</h3>
        <p>
          <strong>Completed:</strong> {stats.completed} |
          <strong> Pending:</strong> {stats.pending} |
          <strong> No-Shows/Cancelled:</strong> {stats.noShows}
        </p>
        <p><strong>Total Appointments:</strong> {stats.total}</p>
      </section>

      <div className="middle-panels">
        <section className="schedule">
          <h3>Today's Schedule</h3>
          {appointments.length === 0 ? (
            <p>No appointments scheduled for today</p>
          ) : (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map(apt => (
                  <tr key={apt.id}>
                    <td>{apt.time}</td>
                    <td>{apt.patientName}</td>
                    <td>{apt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="alerts">
          <h3>Alerts & Urgent Cases</h3>
          {alerts.length === 0 ? (
            <p>No pending alerts</p>
          ) : (
            <div>
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-card ${alert.priority === 'High' ? 'alert-high' : ''}`}>
                  <p className="alert-patient"><strong>{alert.patientName}</strong></p>
                  <p className="alert-message">{alert.message}</p>
                  <p className="alert-priority">Priority: {alert.priority}</p>
                  <div className="alert-actions">
                    <button
                      className="acknowledge-btn"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </button>
                    <button
                      className="view-btn"
                      onClick={() => handleViewPatient(alert.patientId)}
                    >
                      View Patient
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-buttons">
          <button className="action-btn" onClick={handleAddClinicalNote}>
            ➕ Add Clinical Note
          </button>
          <button className="action-btn" onClick={handleScheduleTreatment}>
            📅 Schedule Treatment
          </button>
          <button className="action-btn" onClick={handleViewFollowUps}>
            🗂️ View Follow-Ups
          </button>
        </div>
      </section>
    </div>
  );
};

export default DoctorHome;
