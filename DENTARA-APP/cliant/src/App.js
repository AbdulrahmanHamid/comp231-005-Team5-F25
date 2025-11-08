import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';
import DoctorDashboard from './components/DoctorDashboard/DoctorDashboard';

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

// Temporary Dashboard Components (we'll build these properly next)
const StaffDashboard = () => {
  const { logout } = useAuth();
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Staff Dashboard</h1>
      <p>Welcome! This is your Staff Dashboard.</p>
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

          {/* Protected Routes - Staff */}
          <Route 
            path="/staff-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Doctor */}
          <Route 
            path="/doctor-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Manager */}
          <Route 
            path="/manager-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
