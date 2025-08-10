import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AddCompany from '../admin/AddCompany';
import CompaniesInfo from '../admin/CompaniesInfo';
import StudentsProfile from '../admin/StudentsProfile';
import AdminOverview from '../admin/AdminOverview';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <Header />
      <div className="flex">
        {/* Spacer for layout shift */}
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? 'w-20' : 'w-64'
          }`}
        ></div>

        {/* Main content */}
        <main className="flex-1 p-8 min-h-screen">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="/add-company" element={<AddCompany />} />
            <Route path="/companies-info" element={<CompaniesInfo />} />
            <Route path="/students-profile" element={<StudentsProfile />} />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>

      {/* Fixed Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        handleLogout={handleLogout}
        role="admin"
      />
    </>
  );
};

export default AdminDashboard;
