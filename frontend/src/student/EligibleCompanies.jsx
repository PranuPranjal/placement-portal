import React from 'react';

const EligibleCompanies = () => {
  const [companies, setCompanies] = React.useState([]);
  const [appliedCompanies, setAppliedCompanies] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);
  const [showApplicationModal, setShowApplicationModal] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [cvFile, setCvFile] = React.useState(null);
  const [currentCv, setCurrentCv] = React.useState(null);

  React.useEffect(() => {
    fetchCompanies();
    fetchAppliedCompanies();
    fetchCurrentCv();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      console.log('Making request to /api/student/companies');
      
      const res = await fetch('http://localhost:5000/api/student/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response status:', res.status);
      console.log('Response URL:', res.url);
      
      try {
        const data = await res.json();
        console.log('Response data:', data);
        if (res.ok) {
          setCompanies(data);
        } else {
          console.error('API Error:', data);
        }
      } catch (err) {
        console.error('JSON parsing error:', err);
        console.log('Response text:', await res.text());
      }
    } catch (err) {
      console.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/applied', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCompanies(new Set(data));
      }
    } catch (err) {
      console.error('Failed to fetch applied companies');
    }
  };

  const fetchCurrentCv = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.cvPath) {
        setCurrentCv(data.cvPath);
      }
    } catch (err) {
      console.error('Failed to fetch current CV');
    }
  };

  const handleApply = async (companyId) => {
    setLoading(prev => ({ ...prev, [companyId]: true }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/student/apply/${companyId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setAppliedCompanies(prev => new Set([...prev, companyId]));
        alert('Applied successfully!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to apply');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(prev => ({ ...prev, [companyId]: false }));
    }
  };

  const openApplicationModal = (company) => {
    setSelectedCompany(company);
    setShowApplicationModal(true);
  };

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedCompany(null);
    setCvFile(null);
  };

  const applyToCompany = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      if (cvFile) {
        formData.append('cv', cvFile);
      }
      const res = await fetch(`http://localhost:5000/api/student/apply/${selectedCompany.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        setAppliedCompanies(prev => new Set([...prev, selectedCompany.id]));
        alert('Applied successfully!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to apply');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      closeApplicationModal();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">Eligible Companies</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Salary</th>
              <th className="px-4 py-2 text-left">Deadline</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">File</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr key={i} className="border-b hover:bg-blue-50">
                <td className="px-4 py-2 font-medium">{c.name}</td>
                <td className="px-4 py-2">{c.role}</td>
                <td className="px-4 py-2">{c.salary || c.ctc}</td>
                <td className="px-4 py-2">{c.deadline}</td>
                <td className="px-4 py-2">{c.description}</td>
                <td className="px-4 py-2">
                  {c.filePath ? (
                    <a 
                      href={`http://localhost:5000/uploads/${c.filePath}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-500">No file</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {appliedCompanies.has(c.id) ? (
                    <span className="text-green-600 font-medium">Applied</span>
                  ) : (
                    <button
                      onClick={() => openApplicationModal(c)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Application Modal */}
      {showApplicationModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Apply to {selectedCompany.name}</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Role: {selectedCompany.role}</p>
                <p className="text-sm text-gray-600 mb-2">Salary: {selectedCompany.salary || selectedCompany.ctc}</p>
                <p className="text-sm text-gray-600 mb-4">Deadline: {new Date(selectedCompany.deadline).toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current CV:</label>
                {currentCv ? (
                  <a 
                    href={`http://localhost:5000/uploadcv/${currentCv}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View Current CV
                  </a>
                ) : (
                  <span className="text-gray-500 text-sm">No CV uploaded</span>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload New CV (Optional):</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCvFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <small className="text-gray-500">Leave empty to use current CV</small>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button
                  onClick={applyToCompany}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply Now
                </button>
                <button
                  onClick={closeApplicationModal}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibleCompanies;
