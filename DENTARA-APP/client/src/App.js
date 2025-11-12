import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Home from './pages/Home/Home';
import Login from './pages/Home/Login';
import Signup from './pages/Home/Signup';

import UserProfile from './pages/Home/UserProfile';

import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorHome from './pages/Doctor/DoctorHome';
import DoctorSchedule from './pages/Doctor/DoctorSchedule';
import DoctorPatients from './pages/Doctor/DoctorPatients';

import ClinicDashboard from './pages/Clinic/ClinicDashboard';
import ClinicHome from './pages/Clinic/ClinicHome';
import KPIsView from "./pages/Clinic/KPIsView";           
import NoShowList from "./pages/Clinic/NoShowList";

import AppointmentsPage from "./pages/Clinic/Appointments/AppointmentsPage";   
import ManageAppointments from "./pages/Clinic/Appointments/ManageAppointments";           
import CheckinCancellations from "./pages/Clinic/Appointments/CheckinCancellations";
import TasksPage from "./pages/Clinic/Tasks/TasksPage"; 
import TaskSummary from "./pages/Clinic/Tasks/TaskSummary";           
import TaskList from "./pages/Clinic/Tasks/TaskList";   

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Temporary Manager Dashboard
const ManagerDashboard = () => {
  const { logout } = useAuth();
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Manager Dashboard</h1>
      <p>Welcome! This is your Manager Dashboard.</p>
      <button 
        onClick={logout}
        style={{
          padding: '12px 30px',
          fontSize: '16px',
          backgroundColor: '#7c5cce',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Staff Dashboard */}
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <ClinicDashboard />
              </ProtectedRoute>
            }
          >
            {/* Default → Clinic Home */}
            <Route index element={<ClinicHome />} />
            <Route path="home" element={<ClinicHome />} />

            {/* Combined Pages */}
            <Route path="appointments" element={<AppointmentsPage />}>
              <Route index element={<ManageAppointments />} />
              <Route path="manage" element={<ManageAppointments />} />
              <Route path="checkin" element={<CheckinCancellations />} />
            </Route>

            <Route path="tasks" element={<TasksPage />}>
              <Route index element={<TaskSummary />} />
              <Route path="summary" element={<TaskSummary />} />
              <Route path="list" element={<TaskList />} />
            </Route>


            {/* Additional Pages */}
            <Route path="no-shows" element={<NoShowList />} />
            <Route path="kpis" element={<KPIsView />} />
          </Route>

          {/* Doctor Dashboard (Nested Routes) */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          >
            {/* Default route → Home */}
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<DoctorHome />} />
            <Route path="schedule" element={<DoctorSchedule />} />
            <Route path="patients/*" element={<DoctorPatients />} />
          </Route>

          {/* Manager Dashboard */}
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
