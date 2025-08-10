import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import EligibleCompanies from '../student/EligibleCompanies';
import AppliedCompanies from '../student/AppliedCompanies';
import Profile from '../student/Profile';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <Header />
      <div
        className="flex"
        style={{ paddingLeft: isCollapsed ? '5rem' : '16rem' }}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          handleLogout={handleLogout}
          role="student"
        />
        <main className="flex-1 p-8 min-h-screen">
          <Routes>
            <Route path="/eligible-companies" element={<EligibleCompanies />} />
            <Route path="/applied-companies" element={<AppliedCompanies />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/eligible-companies" />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default StudentDashboard;
