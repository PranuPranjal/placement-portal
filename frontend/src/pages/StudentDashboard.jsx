import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import EligibleCompanies from '../student/EligibleCompanies';
import AppliedCompanies from '../student/AppliedCompanies';
import Profile from '../student/Profile';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4">
        <h2 className="text-xl font-bold text-blue-700 mb-8">Student Dashboard</h2>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li><Link to="/student/eligible-companies" className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium">Eligible Companies</Link></li>
            <li><Link to="/student/applied-companies" className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium">Applied Companies</Link></li>
            <li><Link to="/student/profile" className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium">Profile</Link></li>
          </ul>
        </nav>
        <button 
          onClick={handleLogout}
          className="w-full mt-4 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/eligible-companies" element={<EligibleCompanies />} />
          <Route path="/applied-companies" element={<AppliedCompanies />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Navigate to="/eligible-companies" />} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
