import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/DoctorDashboard.css';

const DoctorHome = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    noShows: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch today's appointments for this doctor
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

      // Calculate stats
      const completed = appointmentsData.filter(a => a.status === 'Completed').length;
      const pending = appointmentsData.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length;
      const noShows = appointmentsData.filter(a => a.status === 'Cancelled' || a.status === 'No-Show').length;

      setStats({
        completed,
        pending,
        noShows,
        total: appointmentsData.length
      });

      // Fetch alerts for this doctor
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
      // Remove from UI
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  if (loading) {
    return <div className="doctor-home"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="doctor-home">
      {/* KPI Summary */}
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
        {/* Today's Schedule */}
        <section className="schedule">
          <h3>Today's Schedule</h3>
          {appointments.length === 0 ? (
            <p>No appointments scheduled for today</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Time</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Patient</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map(apt => (
                  <tr key={apt.id}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{apt.time}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{apt.patientName}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{apt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Alerts & Urgent Cases */}
        <section className="alerts">
          <h3>Alerts & Urgent Cases</h3>
          {alerts.length === 0 ? (
            <p>No pending alerts</p>
          ) : (
            <div>
              {alerts.map(alert => (
                <div key={alert.id} style={{ 
                  backgroundColor: 'white', 
                  padding: '10px', 
                  marginBottom: '10px', 
                  borderRadius: '5px',
                  border: alert.priority === 'High' ? '2px solid red' : '1px solid #ccc'
                }}>
                  <p><strong>{alert.patientName}</strong></p>
                  <p>{alert.message}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>Priority: {alert.priority}</p>
                  <div className="alert-actions">
                    <button 
                      className="acknowledge-btn"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </button>
                    <button className="view-btn">View Patient</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-buttons">
          <button className="action-btn">➕ Add Clinical Note</button>
          <button className="action-btn">📅 Schedule Treatment</button>
          <button className="action-btn">🗂️ View Follow-Ups</button>
        </div>
      </section>
    </div>
  );
};

export default DoctorHome;
