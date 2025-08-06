import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import AddCompany from '../admin/AddCompany';
import CompaniesInfo from '../admin/CompaniesInfo';
import StudentsProfile from '../admin/StudentsProfile';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4">
        <h2 className="text-xl font-bold text-blue-700 mb-8">Admin Dashboard</h2>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li><Link to="/admin/add-company" className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium">Add Company</Link></li>
            <li><Link to="/admin/companies-info" className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium">Companies Info</Link></li>
            <li><Link to="/admin/students-profile" className="block px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium">Students Profile</Link></li>
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
          <Route path="/add-company" element={<AddCompany />} />
          <Route path="/companies-info" element={<CompaniesInfo />} />
          <Route path="/students-profile" element={<StudentsProfile />} />
          <Route path="/" element={<Navigate to="/add-company" />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
