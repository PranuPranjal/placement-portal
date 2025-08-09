import React, { useState, useEffect } from 'react';

const CompanyApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Auto-scroll to top when profile modal opens
  useEffect(() => {
    if (showModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showModal]);

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
        // Update local state
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
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading applicants...</div>;
  }

  return (
    <div style={{ marginLeft: '16rem'}}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Applicants</h1>
      <br />
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
      {applicants.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No students have applied yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CGPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants
                .filter(applicant => selectedBranch === 'All' || applicant.student.branch === selectedBranch)
                .map((applicant) => (
                <tr key={applicant.applicationId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {applicant.student.photoPath ? (
                        <img 
                          src={`http://localhost:5000/uploadphoto/${applicant.student.photoPath}`}
                          alt="Profile"
                          style={{
                            width: '8rem',
                            height: '8rem',
                            borderRadius: '50%',
                            objectFit: 'contain',
                            border: '2px solid #60a5fa'
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-gray-500 text-xs">No Photo</span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {applicant.student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {applicant.student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {applicant.student.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {applicant.student.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {applicant.student.cgpa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(applicant.appliedAt).toLocaleDateString()}
                  </td>
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
                    <button
                      onClick={() => viewStudentProfile(applicant.student)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Profile
                    </button>
                    {applicant.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(applicant.applicationId, 'accepted')}
                          className="text-green-600 hover:text-green-900 ml-2"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(applicant.applicationId, 'rejected')}
                          className="text-red-600 hover:text-red-900 ml-2"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Profile Modal */}
      {showModal && selectedStudent && (
        <div className="modal-overlay modal-overlay-top">
          <div className="modal-content modal-content--wide modal-content--no-scroll">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Student Profile</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Info */}
              <div>
                <div className="flex items-center mb-4">
                  {selectedStudent.photoPath ? (
                    <img 
                      src={`http://localhost:5000/uploadphoto/${selectedStudent.photoPath}`}
                      alt="Profile"
                      style={{
                        width: '8rem',
                        height: '8rem',
                        borderRadius: '50%',
                        objectFit: 'contain',
                        border: '2px solid #60a5fa'
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-gray-500 text-sm">No Photo</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedStudent.name}</h4>
                    <p className="text-gray-600">{selectedStudent.email}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <p className="text-gray-900">{selectedStudent.branch}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CGPA</label>
                    <p className="text-gray-900">{selectedStudent.cgpa}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">X Percentage</label>
                    <p className="text-gray-900">{selectedStudent.XPercentage}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">XII Percentage</label>
                    <p className="text-gray-900">{selectedStudent.XIIPercentage}</p>
                  </div>
                </div>
              </div>
              
              {/* Documents */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Documents</h4>
                <div className="space-y-2">
                  {selectedStudent.cvPath && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CV</label>
                      <a 
                        href={`http://localhost:5000/uploadcv/${selectedStudent.cvPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View CV
                      </a>
                    </div>
                  )}
                  
                  {selectedStudent.aadharPath && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Aadhar Card</label>
                      <a 
                        href={`http://localhost:5000/uploadaadhar/${selectedStudent.aadharPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Aadhar
                      </a>
                    </div>
                  )}
                  
                  {selectedStudent.ugMarksheetPath && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">UG Marksheet</label>
                      <a 
                        href={`http://localhost:5000/uploadugmarks/${selectedStudent.ugMarksheetPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View UG Marksheet
                      </a>
                    </div>
                  )}
                  
                  {selectedStudent.xMarksheetPath && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">X Marksheet</label>
                      <a 
                        href={`http://localhost:5000/uploadxmarks/${selectedStudent.xMarksheetPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View X Marksheet
                      </a>
                    </div>
                  )}
                  
                  {selectedStudent.xiiMarksheetPath && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">XII Marksheet</label>
                      <a 
                        href={`http://localhost:5000/uploadxiimarks/${selectedStudent.xiiMarksheetPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View XII Marksheet
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApplicants;
