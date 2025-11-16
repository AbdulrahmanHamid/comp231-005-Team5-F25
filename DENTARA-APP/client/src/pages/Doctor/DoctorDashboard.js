// Doctor dashboard layout component
// Done by Vaibhav Kalia
// Reason: Provides a consistent layout (sidebar + header + main content) for all doctor-facing pages.

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiLogOut, FiHome, FiCalendar, FiUsers } from 'react-icons/fi';
import '../../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
    const { logout } = useAuth(); // Reason: Get logout function so doctors can securely sign out.

    return (
        <div className="doctor-layout">
            {/* Header
          Reason: Shows a clear title so doctors know they’re in their dashboard area. */}
            <header className="doctor-header">
                <h1>👨‍⚕️ Doctor Dashboard</h1>
            </header>

            <div className="doctor-body">
                {/* Sidebar
            Reason: Central navigation for doctor pages (home, schedule, patients) in one place. */}
                <aside className="doctor-sidebar">
                    <nav>
                        <ul>
                            <li>
                                {/* NavLink is used so active link styling works automatically. */}
                                <NavLink to="/doctor-dashboard/home" className="nav-link">
                                    <FiHome className="nav-icon" /> Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/doctor-dashboard/schedule" className="nav-link">
                                    <FiCalendar className="nav-icon" /> Schedule
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/doctor-dashboard/patients" className="nav-link">
                                    <FiUsers className="nav-icon" /> Patients
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                    {/* Logout button
              Reason: Allows doctors to end their session from anywhere in the dashboard. */}
                    <button className="signout-btn" onClick={logout}>
                        <FiLogOut className="logout-icon" />
                        Sign Out
                    </button>
                </aside>

                {/* Main Content Area
            Reason: Outlet renders the nested routes (home, schedule, patients) inside this layout. */}
                <main className="doctor-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DoctorDashboard;
