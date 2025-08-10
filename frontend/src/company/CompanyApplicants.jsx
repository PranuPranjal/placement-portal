import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaFilePdf, FaIdCard, FaFileAlt, FaTimes } from 'react-icons/fa';

const CompanyApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    let result = applicants;
    if (selectedBranch !== 'All') {
      result = result.filter(app => app.student.branch === selectedBranch);
    }
    setFilteredApplicants(result);
  }, [selectedBranch, applicants]);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/company/applicants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplicants(data);
        setFilteredApplicants(data);
        const uniqueBranches = Array.from(
          new Set(data.map(app => app.student.branch))
        );
        setBranches(uniqueBranches);
      } else {
        console.error('Failed to fetch applicants');
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/company/applicants/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setApplicants(prev => prev.map(app => 
          app.applicationId === applicationId 
            ? { ...app, status } 
            : app
        ));
        alert(`Application ${status} successfully!`);
      } else {
        alert('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    }
  };

  const viewStudentProfile = (student) => {
    window.scrollTo(0, 0);
    setSelectedStudent(student);
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading applicants...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 relative">
      {showProfile && selectedStudent && (
        <ProfileOverlay student={selectedStudent} onClose={closeProfile} />
      )}
      <h1 className="text-lg font-semibold text-blue-700 mb-4">Applicants</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Branch:</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="All">All</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>{branch}</option>
          ))}
        </select>
      </div>
      {filteredApplicants.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No students have applied yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.applicationId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {applicant.student.photoPath ? (
                        <img src={`http://localhost:5000/uploadphoto/${applicant.student.photoPath}`} alt="Profile" className="w-10 h-10 rounded-full object-conatin" />
                      ) : (
                        <FaUserCircle className="w-10 h-10 text-gray-300" />
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{applicant.student.name}</div>
                        <div className="text-sm text-gray-500">{applicant.student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.student.branch}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.student.cgpa}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(applicant.appliedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      applicant.status === 'accepted' 
                        ? 'bg-green-100 text-green-800'
                        : applicant.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => viewStudentProfile(applicant.student)} className="text-blue-600 hover:text-blue-900">View Profile</button>
                    {applicant.status === 'pending' && (
                      <>
                        <button onClick={() => updateApplicationStatus(applicant.applicationId, 'accepted')} className="text-green-600 hover:text-green-900">Accept</button>
                        <button onClick={() => updateApplicationStatus(applicant.applicationId, 'rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ProfileOverlay = ({ student, onClose }) => (
    <div className="absolute inset-0 bg-white rounded-xl p-6 z-20" style={{ maxHeight: '95vh' }}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Student Profile</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
            </button>
        </div>
        <ProfileView student={student} />
    </div>
);

const ProfileView = ({ student }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
    <div style={{ padding: '2rem', backgroundColor: '#fff', color: 'black', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {student.photoPath ? (
                <img
                    src={`http://localhost:5000/uploadphoto/${student.photoPath}`}
                    alt="Profile"
                    style={{ width: '6rem', height: '6rem', borderRadius: '9999px', objectFit: 'contain', border: '4px solid #93c5fd' }}
                />
            ) : (
                <FaUserCircle style={{ width: '6rem', height: '6rem', color: '#d1d5db' }} />
            )}
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>{student.name || 'Your Name'}</h1>
                <p style={{ fontSize: '1rem', color: 'black' }}>{student.email}</p>
                <p style={{ fontSize: '0.875rem', color: '#93c5fd', fontWeight: '600', marginTop: '0.25rem' }}>
                    {student.branch ? student.branch.name : 'Branch'} • CGPA: {student.cgpa ?? '-'}
                </p>
            </div>
        </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Personal & Academic Details</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>Name:</span>
                    <span>{student.name || '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>Email:</span>
                    <span>{student.email || '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>Branch:</span>
                    <span>{student.branch ? student.branch.name : '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>CGPA:</span>
                    <span>{student.cgpa ?? '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>X %:</span>
                    <span>{student.XPercentage ?? '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>XII %:</span>
                    <span>{student.XIIPercentage ?? '-'}</span>
                </li>
                 <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: '#4b5563' }}>Roll / Reg:</span>
                  <span>{student.rollNumber || '-'} / {student.registrationNumber || '-'}</span>
                </li>
            </ul>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Documents</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <DocumentItem icon={<FaFilePdf style={{ color: '#ef4444' }} />} label="CV" path={student.cvPath} type="uploadcv" />
                <DocumentItem icon={<FaIdCard style={{ color: '#6366f1' }} />} label="Aadhar" path={student.aadharPath} type="uploadaadhar" />
                <DocumentItem icon={<FaFileAlt style={{ color: '#10b981' }} />} label="UG Marksheet" path={student.ugMarksheetPath} type="uploadugmarks" />
                <DocumentItem icon={<FaFileAlt style={{ color: '#f59e0b' }} />} label="X Marksheet" path={student.xMarksheetPath} type="uploadxmarks" />
                <DocumentItem icon={<FaFileAlt style={{ color: '#8b5cf6' }} />} label="XII Marksheet" path={student.xiiMarksheetPath} type="uploadxiimarks" />
            </div>
        </div>
    </div>
  </div>
);

const DocumentItem = ({ icon, label, path, type }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon}
            <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>{label}</span>
        </div>
        {path ? (
            <a href={`http://localhost:5000/${type}/${path}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline', fontSize: '0.875rem' }}>
                View
            </a>
        ) : (
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Not Uploaded</span>
        )}
    </div>
);

export default CompanyApplicants;