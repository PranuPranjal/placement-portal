import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import EligibleCompanies from '../student/EligibleCompanies';
import AppliedCompanies from '../student/AppliedCompanies';
import Profile from '../student/Profile';
import Header from '../components/Header';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/student/eligible-companies') {
      return location.pathname === '/student/eligible-companies';
    }
    if (path === '/student/applied-companies') {
      return location.pathname === '/student/applied-companies';
    }
    if (path === '/student/profile') {
      return location.pathname === '/student/profile';
    }
    return location.pathname === path;
  };
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden pl-[280px]">
      <aside className="fixed left-0 top-0 w-64 h-screen overflow-y-auto bg-white shadow-lg z-30 flex flex-col py-8 px-4">
        <h2 className="text-xl font-bold text-blue-700 mb-8">Student</h2>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li><Link to="/student/eligible-companies" className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium"
            style={isActive('/student/eligible-companies') 
              ? { backgroundColor: '#2563eb', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
              : { color: '#374151' }}
            >Eligible Companies</Link></li>
            <li><Link to="/student/applied-companies" className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium"
            style={isActive('/student/applied-companies') 
              ? { backgroundColor: '#2563eb', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
              : { color: '#374151' }}
            >Applied Companies</Link></li>
            <li><Link to="/student/profile" className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium"
            style={isActive('/student/profile') 
              ? { backgroundColor: '#2563eb', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
              : { color: '#374151' }}
            >Profile</Link></li>
          </ul>
        </nav>
        <button 
          onClick={handleLogout}
          className="w-full mt-4 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          Logout
        </button>
      </aside>
      <main className="min-w-0 p-8 overflow-x-auto min-h-screen">
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
