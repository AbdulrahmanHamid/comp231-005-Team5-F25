import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Main routing and role-based dashboard setup
// Done by Vaibhav Kalia
// Reason: Centralizes all app routes and applies role-based protection in one place.

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

import PatientsPage from "./pages/Clinic/Patients/PatientsPage";
import DoctorPatientsPage from "./pages/Clinic/Patients/DoctorPatients";
import AllPatientsPage from "./pages/Clinic/Patients/AllPatients";
import PatientDetailsPage from "./pages/Clinic/Patients/PatientDetails";

// Protected Route Component
// Reason: Wraps routes so only logged-in users with allowed roles can access them.
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
// Reason: Simple placeholder view for managers until a full dashboard UI is implemented.
const ManagerDashboard = () => {
    const { logout } = useAuth();
    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Manager Dashboard</h1>
            <p>Welcome! This is your Manager Dashboard.</p>
            <button
                onClick={logout}
                // Improved button styling for better UI look — Done by Vaibhav Kalia
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

                    <Route
                        path="/complete-profile"
                        element={
                            <ProtectedRoute allowedRoles={['staff', 'doctor', 'manager']}>
                                <UserProfile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Staff Dashboard */}
                    <Route
                        path="/staff-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['staff']}>
                                <ClinicDashboard />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<ClinicHome />} />
                        <Route path="home" element={<ClinicHome />} />

                        <Route path="appointments" element={<AppointmentsPage />}>
                            <Route index element={<Navigate to="manage" replace />} />
                            <Route path="manage" element={<ManageAppointments />} />
                            <Route path="checkin" element={<CheckinCancellations />} />
                        </Route>

                        <Route path="tasks" element={<TasksPage />}>
                            <Route index element={<Navigate to="summary" replace />} />
                            <Route path="summary" element={<TaskSummary />} />
                            <Route path="list" element={<TaskList />} />
                        </Route>

                        <Route path="patients" element={<PatientsPage />} />
                        <Route path="patients/doctor/:doctorId" element={<DoctorPatientsPage />} />
                        <Route path="patients/all" element={<AllPatientsPage />} />
                        <Route path="patients/details/:patientId" element={<PatientDetailsPage />} />

                        <Route path="no-shows" element={<NoShowList />} />
                        <Route path="kpis" element={<KPIsView />} />
                    </Route>

                    {/* Doctor Dashboard  */}
                    <Route
                        path="/doctor-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['doctor']}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="home" element={<DoctorHome />} />
                        <Route path="schedule" element={<DoctorSchedule />} />
                        <Route path="patients/*" element={<DoctorPatients />} />
                    </Route>

                    <Route
                        path="/manager-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <ManagerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    {/* Catch-All Route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
