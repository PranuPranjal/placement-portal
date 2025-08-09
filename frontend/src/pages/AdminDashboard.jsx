import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AddCompany from '../admin/AddCompany';
import CompaniesInfo from '../admin/CompaniesInfo';
import StudentsProfile from '../admin/StudentsProfile';
import AdminOverview from '../admin/AdminOverview';
import Header from '../components/Header';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === path;
  };
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <aside className="fixed left-0 top-0 w-64 h-screen overflow-y-auto bg-white shadow-lg z-30 flex flex-col py-8 px-4">
        <h2 className="text-xl font-bold text-blue-700 mb-8">Admin Dashboard</h2>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/admin" 
                className="block px-3 py-2 rounded-lg font-medium transition-colors"
                style={isActive('/admin') 
                  ? { backgroundColor: '#2563eb', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                  : { color: '#374151' }
                }
              >
                Overview
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/add-company" 
                className="block px-3 py-2 rounded-lg font-medium transition-colors"
                style={isActive('/admin/add-company') 
                  ? { backgroundColor: '#2563eb', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                  : { color: '#374151' }
                }
              >
                Add Company
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/companies-info" 
                className="block px-3 py-2 rounded-lg font-medium transition-colors"
                style={isActive('/admin/companies-info') 
                  ? { backgroundColor: '#2563eb', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                  : { color: '#374151' }
                }
              >
                Companies Info
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/students-profile" 
                className="block px-3 py-2 rounded-lg font-medium transition-colors"
                style={isActive('/admin/students-profile') 
                  ? { backgroundColor: '#2563eb', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                  : { color: '#374151' }
                }
              >
                Students Profile
              </Link>
            </li>
          </ul>
        </nav>
        <button 
          onClick={handleLogout}
          className="w-full mt-4 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          Logout
        </button>
      </aside>
      <main className="ml-[280px] min-w-0 p-8 overflow-x-auto min-h-screen">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="/add-company" element={<AddCompany />} />
          <Route path="/companies-info" element={<CompaniesInfo />} />
          <Route path="/students-profile" element={<StudentsProfile />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
    </>
  );
};

export default AdminDashboard;
