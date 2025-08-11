import React from 'react';
import { FaRegFolderOpen} from 'react-icons/fa';
import { MdOutlineOpenInFull, MdOutlineCloseFullscreen } from "react-icons/md";

const CompaniesInfo = () => {
  const [companies, setCompanies] = React.useState([]);
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [applicants, setApplicants] = React.useState([]);
  console.log(applicants);
  const [showApplicants, setShowApplicants] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCompanies(data);
    };
    fetchCompanies();
  }, []);

  // Auto-scroll to top when applicants panel opens
  React.useEffect(() => {
    if (showApplicants) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showApplicants]);

  const fetchApplicants = async (companyId, companyName) => {
    setLoading(true);
    setSelectedCompany(companyName);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/companies/${companyId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setApplicants(data);
        setShowApplicants(true);
      } else {
        alert(data.error || 'Failed to fetch applicants');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const closeApplicants = () => {
    setShowApplicants(false);
    setApplicants([]);
    setSelectedCompany(null);
  };
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">Companies Info</h3>
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
              <th className="px-4 py-2 text-left">Applicants</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr key={i} className="border-b hover:bg-blue-50">
                <td className="px-4 py-2 font-medium">{c.name}</td>
                <td className="px-4 py-2">{c.role}</td>
                <td className="px-4 py-2">{c.salary || c.ctc}</td>
                <td className="px-4 py-2">
                  {new Date(c.deadline).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-2">{c.description}</td>
                <td className="px-4 py-2">
                  {c.filePath ? (
                    <a 
                      href={`http://localhost:5000/uploads/${c.filePath}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:text-blue-800"
                    >
                      Open <FaRegFolderOpen size={20} className="inline-block ml-1" />
                    </a>
                  ) : (
                    <span className="text-gray-500">No file</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => fetchApplicants(c.id, c.name)}
                    disabled={loading}
                    className="px-3 py-1 text-blue-600 font-bold rounded hover:text-blue-800 hover:cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'View'} <MdOutlineOpenInFull size={20} className="inline-block ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Applicants Modal */}
      {showApplicants && (
        <div className="modal-overlay modal-overlay-top">
          <div className="modal-content modal-content--wide modal-content--no-scroll">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-blue-700">
                Applicants for {selectedCompany}
              </h4>
              <button
                onClick={closeApplicants}
                className="text-gray-500 size-20 hover:text-gray-700 hover:cursor-pointer text-xl"
              >
                <MdOutlineCloseFullscreen size={20} className="inline-block ml-1" />
              </button>
            </div>
            
            {applicants.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No applicants yet</p>
            ) : (
              <div>
                <table className="min-w-full text-sm text-gray-700">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Branch</th>
                      <th className="px-4 py-2 text-left">CGPA</th>
                      <th className="px-4 py-2 text-left">CV</th>
                      <th className="px-4 py-2 text-left">UG Marksheet</th>
                      <th className="px-4 py-2 text-left">XII Marksheet</th>
                      <th className="px-4 py-2 text-left">X Marksheet</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((applicant, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{applicant.name}</td>
                        <td className="px-4 py-2">{applicant.email}</td>
                        <td className="px-4 py-2">{applicant.branch}</td>
                        <td className="px-4 py-2">{applicant.cgpa}</td>
                        <td className="px-4 py-2">
                          {applicant.cvPath ? (
                            <a 
                              href={`http://localhost:5000/uploadcv/${applicant.cvPath}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 font-bold hover:text-blue-800"
                            >
                              View <FaRegFolderOpen size={20} className="inline-block ml-1" />
                            </a>
                          ) : (
                            <span className="text-gray-500">No CV</span>
                          )}
                        </td> 
                        <td className="px-4 py-2">
                          {applicant.ugMarksheetPath ? (
                            <a 
                              href={`http://localhost:5000/uploadugmarks/${applicant.ugMarksheetPath}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-bold"
                            >
                              View <FaRegFolderOpen size={20} className="inline-block ml-1" />
                            </a>
                          ) : (
                            <span className="text-gray-500">No UG Marksheet</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {applicant.xiiMarksheetPath ? (
                            <a 
                              href={`http://localhost:5000/uploadxiimarks/${applicant.xiiMarksheetPath}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-bold"
                            >
                              View <FaRegFolderOpen size={20} className="inline-block ml-1" />
                            </a>
                          ) : (
                            <span className="text-gray-500">No XII Marksheet</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {applicant.xMarksheetPath ? (
                            <a 
                              href={`http://localhost:5000/uploadxmarks/${applicant.xMarksheetPath}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-bold"
                            >
                              View <FaRegFolderOpen size={20} className="inline-block ml-1" />
                            </a>
                          ) : (
                            <span className="text-gray-500">No X Marksheet</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            applicant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            applicant.status === 'SELECTED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {applicant.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesInfo;
