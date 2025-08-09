import React from 'react';

const StudentsProfile = () => {
  const [students, setStudents] = React.useState([]);
  const [filteredStudents, setFilteredStudents] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [selectedBranch, setSelectedBranch] = React.useState('All');
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data);
        setFilteredStudents(data);

        // Extract unique branches
        const uniqueBranches = Array.from(
          new Set(data.map((s) => s.branch?.name).filter(Boolean))
        );
        setBranches(uniqueBranches);
      }
    };
    fetchStudents();
  }, []);

  React.useEffect(() => {
    if (selectedBranch === 'All') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter(s => s.branch?.name === selectedBranch));
    }
  }, [selectedBranch, students]);

  // Smoothly scroll to the top when opening the modal
  React.useEffect(() => {
    if (showModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showModal]);

  const viewStudentProfile = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">Students Profile</h3>
      <div className="mb-4">
        <label className="mr-2 font-medium text-gray-700">Filter by Branch:</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="All">All</option>
          {branches.map((branch, i) => (
            <option key={i} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Branch</th>
              <th className="px-4 py-2 text-left">CGPA</th>
              {/* <th className="px-4 py-2 text-left">Photo</th>
              <th className="px-4 py-2 text-left">CV</th>
              <th className="px-4 py-2 text-left">UG Marksheet</th>
              <th className="px-4 py-2 text-left">X Marksheet</th>
              <th className="px-4 py-2 text-left">XII Marksheet</th>
              <th className="px-4 py-2 text-left">Aadhar Card</th> */}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={i} className="border-b hover:bg-blue-50">
                <td className="px-4 py-2 font-medium">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.branch?.name || ''}</td>
                <td className="px-4 py-2">{s.cgpa}</td>
                {/* <td className="px-4 py-2">
                  {s.photoPath ? (
                    <a href={`http://localhost:5000/uploadphoto/${s.photoPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View</a>
                  ) : <span className="text-gray-500">No photo</span>}
                </td>
                <td className="px-4 py-2">
                  {s.cvPath ? (
                    <a href={`http://localhost:5000/uploadcv/${s.cvPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View</a>
                  ) : <span className="text-gray-500">No CV</span>}
                </td>
                <td className="px-4 py-2">
                  {s.ugMarksheetPath ? (
                    <a href={`http://localhost:5000/uploadugmarks/${s.ugMarksheetPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View</a>
                  ) : <span className="text-gray-500">No UG Marksheet</span>}
                </td>
                <td className="px-4 py-2">
                  {s.xMarksheetPath ? (
                    <a href={`http://localhost:5000/uploadxmarks/${s.xMarksheetPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View</a>
                  ) : <span className="text-gray-500">No X Marksheet</span>}
                </td>
                <td className="px-4 py-2">
                  {s.xiiMarksheetPath ? (
                    <a href={`http://localhost:5000/uploadxiimarks/${s.xiiMarksheetPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View</a>
                  ) : <span className="text-gray-500">No XII Marksheet</span>}
                </td>
                <td className="px-4 py-2">
                  {s.aadharPath ? (
                    <a href={`http://localhost:5000/uploadaadhar/${s.aadharPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View</a>
                  ) : <span className="text-gray-500">No Aadhar Card</span>}
                </td> */}
                <td className="px-4 py-2">
                  <button
                    onClick={() => viewStudentProfile(s)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                    <p className="text-gray-900">{selectedStudent.branch?.name || ''}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CGPA</label>
                    <p className="text-gray-900">{selectedStudent.cgpa}</p>
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

export default StudentsProfile;
