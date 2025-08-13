import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import CompanyApplicants from '../company/CompanyApplicants';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
import { FaFile } from 'react-icons/fa';

const CompanyDashboard = () => {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/company/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCompanyProfile(data);
      } else {
        console.error('Failed to fetch company profile');
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!companyProfile) {
    return <div className="flex justify-center items-center h-screen">Company profile not found</div>;
  }

  const isActive = (path) => {
    if (path === '/company/applicants') {
      return location.pathname === '/company/applicants';
    }
    if (path === '/company/profile') {
      return location.pathname === '/company/profile';
    }
    return location.pathname === path;
  };

  return (
    <>
    <Header />
      {/* Sidebar */}
      {/* <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {companyProfile.company.name}
          </h2>
          <p className="text-sm text-gray-600">{companyProfile.user.email}</p>
        </div>
        
        <nav className="mt-6">
          <Link 
            to="/company/applicants" 
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-l-4 border-transparent hover:border-blue-600"
          >
            View Applicants
          </Link>
          
          <Link 
            to="/company/profile" 
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-l-4 border-transparent hover:border-blue-600"
          >
            Company Profile
          </Link>
        </nav>
        
        <div className="absolute bottom-6 left-6">
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Logout
          </button>
        </div>
      </div> */}
      <div
        className="flex"
        style={{ paddingLeft: isCollapsed ? '5rem' : '16rem' }}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          handleLogout={handleLogout}
          role="company"
        />
      {/* Main Content */}
      <div className="flex-1 p-8 min-h-screen">
        <Routes>
          <Route path="/" element={<CompanyHome companyProfile={companyProfile} />} />
          <Route path="/applicants" element={<CompanyApplicants />} />
          <Route path="/profile" element={<CompanyProfile companyProfile={companyProfile} />} />
        </Routes>
      </div>
    </div>
    </>
  );
};

// Company Home Component
const CompanyHome = ({ companyProfile }) => {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl shadow p-6 relative">
      <h1 className="text-lg font-semibold text-blue-700 mb-4">
        Welcome, {companyProfile.company.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Company Details</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Role:</span> {companyProfile.company.role}</p>
            <p><span className="font-medium">Salary:</span> ₹{companyProfile.company.salary.toLocaleString()}</p>
            <p><span className="font-medium">CGPA Criteria:</span> {companyProfile.company.cgpaCriteria}</p>
            <p><span className="font-medium">Deadline:</span> {new Date(companyProfile.company.deadline).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/company/applicants"
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700"
            >
              View Applicants
            </Link>
            <Link 
              to="/company/profile"
              className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded hover:bg-gray-700"
            >
              View Profile
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
          <p className="text-sm text-gray-600">
            {companyProfile.company.description || 'No description available'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Company Profile Component
const CompanyProfile = ({ companyProfile }) => {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl shadow p-6 relative">
      <h1 className="text-lg font-semibold text-blue-700 mb-4">Company Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-blue-500 mb-4">Company Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-blue-300">Company Name</label>
              <p className="text-white">{companyProfile.company.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-300">Role</label>
              <p className="text-white">{companyProfile.company.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-300">Salary</label>
              <p className="text-white">₹{companyProfile.company.salary.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-300">CGPA Criteria</label>
              <p className="text-white">{companyProfile.company.cgpaCriteria}</p>
            </div>
          </div>
        </div>

        <div>
          {/* <h3 className="text-lg font-semibold text-blue-500 mb-4">Contact Information</h3> */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-blue-300">Application Deadline</label>
              <p className="text-white">{new Date(companyProfile.company.deadline).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-300">Description</label>
              <p className="text-white">{companyProfile.company.description || 'No description available'}</p>
            </div>
          </div>
        </div>
      </div>

      {companyProfile.company.filePath && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-blue-500 mb-2">Company File</label>
          <a 
            href={`http://localhost:5000/uploads/${companyProfile.company.filePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-800"
          >
            <span className='flex items-center gap-2'><FaFile />View Company File</span>
          </a>
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-md font-semibold text-blue-500 mb-2">Allowed Branches</h4>
        <div className="flex flex-wrap gap-2">
          {companyProfile.company.allowedBranches.map((ab) => (
            <span 
              key={ab.id}
              className="bg-gray-700 text-white text-l px-2 py-1 rounded"
            >
              {ab.branch.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
