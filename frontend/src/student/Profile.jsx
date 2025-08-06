import React from 'react';

const Profile = () => {
  const [student, setStudent] = React.useState(null);
  const [branches, setBranches] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: '',
    cgpa: '',
    branchId: ''
  });
  const [cvFile, setCvFile] = React.useState(null);
  const [photoFile, setPhotoFile] = React.useState(null);
  const [aadharFile, setAadharFile] = React.useState(null);
  const [ugMarksheetFile, setUgMarksheetFile] = React.useState(null);
  const [xMarksheetFile, setXMarksheetFile] = React.useState(null);
  const [xiiMarksheetFile, setXiiMarksheetFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStudent(data);
        setEditForm({
          name: data.name,
          cgpa: data.cgpa.toString(),
          branchId: data.branchId.toString()
        });
      }
    };
    
    const fetchBranches = async () => {
      const res = await fetch('http://localhost:5000/api/branches');
      const data = await res.json();
      if (res.ok) setBranches(data);
    };
    
    fetchProfile();
    fetchBranches();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: student.name,
      cgpa: student.cgpa.toString(),
      branchId: student.branchId.toString()
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('cgpa', editForm.cgpa);
      formData.append('branchId', editForm.branchId);
      
      if (cvFile) {
        formData.append('cv', cvFile);
      }
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      if (aadharFile) {
        formData.append('aadhar', aadharFile);
      }
      if (ugMarksheetFile) {
        formData.append('ugMarksheet', ugMarksheetFile);
      }
      if (xMarksheetFile) {
        formData.append('xMarksheet', xMarksheetFile);
      }
      if (xiiMarksheetFile) {
        formData.append('xiiMarksheet', xiiMarksheetFile);
      }
      
      console.log('Sending profile update with CV:', { 
        name: editForm.name, 
        cgpa: editForm.cgpa, 
        branchId: editForm.branchId,
        cvFile: cvFile ? cvFile.name : 'none',
        photoFile: photoFile ? photoFile.name : 'none',
        aadharFile: aadharFile ? aadharFile.name : 'none',
        ugMarksheetFile: ugMarksheetFile ? ugMarksheetFile.name : 'none',
        xMarksheetFile: xMarksheetFile ? xMarksheetFile.name : 'none',
        xiiMarksheetFile: xiiMarksheetFile ? xiiMarksheetFile.name : 'none'       
      });
      
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
          // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData
      });
      
      if (res.ok) {
        const updatedStudent = await res.json();
        setStudent(updatedStudent);
        setIsEditing(false);
        alert('Profile updated successfully!');
        // Refresh to get updated branch info
        window.location.reload();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };
  if (!student) return <div className="text-center text-gray-500">Loading...</div>;
  
  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-blue-700">Profile</h3>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>
      
      {/* Profile Photo Display */}
      <div className="flex justify-center mb-6">
        {student.photoPath ? (
          <img 
            src={`http://localhost:5000/uploadphoto/${student.photoPath}`}
            alt="Profile Photo"
            style={{
              width: '8rem',
              height: '8rem',
              borderRadius: '50%',
              objectFit: 'contain',
              border: '2px solid #60a5fa',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        ) : (
          <div style={{
            width: '8rem',
            height: '8rem',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            border: '2px solid #9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>No Photo</span>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={student.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <small className="text-gray-500">Email cannot be changed</small>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select
              value={editForm.branchId}
              onChange={(e) => setEditForm({...editForm, branchId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={editForm.cgpa}
              onChange={(e) => setEditForm({...editForm, cgpa: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CV Upload</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {student.cvPath && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Current CV: </span>
                <a 
                  href={`http://localhost:5000/uploadcv/${student.cvPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View Current CV
                </a>
              </div>
            )}
            <small className="text-gray-500">Upload PDF, DOC, or DOCX files only</small>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <div className="flex items-center space-x-4">
              {student.photoPath ? (
                <img 
                  src={`http://localhost:5000/uploadphoto/${student.photoPath}`}
                  alt="Current Profile Photo"
                  style={{
                    width: '8rem',
                    height: '8rem',
                    borderRadius: '50%',
                    objectFit: 'contain',
                    border: '2px solid #60a5fa'
                  }}
                />
              ) : (
                <div style={{
                  width: '8rem',
                  height: '8rem',
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  border: '2px solid #9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>No Photo</span>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <small className="text-gray-500">Upload JPEG, PNG, or JPG files only</small>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Upload</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setAadharFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {student.aadharPath && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Current Aadhar: </span>
                <a 
                  href={`http://localhost:5000/uploadaadhar/${student.aadharPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View Current Aadhar
                </a>
              </div>
            )}
            <small className="text-gray-500">Upload PDF, DOC, or DOCX files only</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UG Marksheet Upload</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setUgMarksheetFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {student.ugMarksheetPath && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Current UG Marksheet: </span>
                <a 
                  href={`http://localhost:5000/uploadugmarks/${student.ugMarksheetPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View Current UG Marksheet
                </a>
              </div>
            )}
            <small className="text-gray-500">Upload PDF, DOC, or DOCX files only</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">X Marksheet Upload</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setXMarksheetFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {student.xMarksheetPath && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Current X Marksheet: </span>
                <a 
                  href={`http://localhost:5000/uploadxmarks/${student.xMarksheetPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View Current X Marksheet
                </a>
              </div>
            )}
            <small className="text-gray-500">Upload PDF, DOC, or DOCX files only</small>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">XII Marksheet Upload</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setXiiMarksheetFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {student.xiiMarksheetPath && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Current XII Marksheet: </span>
                <a 
                  href={`http://localhost:5000/uploadxiimarks/${student.xiiMarksheetPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View Current XII Marksheet
                </a>
              </div>
            )}
            <small className="text-gray-500">Upload PDF, DOC, or DOCX files only</small>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="font-medium text-gray-700">Name:</span> {student.name}</div>
            <div><span className="font-medium text-gray-700">Email:</span> {student.email}</div>
            <div><span className="font-medium text-gray-700">Branch:</span> {student.branch ? student.branch.name : ''}</div>
            <div><span className="font-medium text-gray-700">CGPA:</span> {student.cgpa}</div>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-700 mb-2">Documents:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">CV:</span> 
                {student.cvPath ? (
                  <a 
                    href={`http://localhost:5000/uploadcv/${student.cvPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline ml-2"
                  >
                    View CV
                  </a>
                ) : (
                  <span className="text-gray-500 ml-2">Not uploaded</span>
                )}
              </div>
              <div>
                <span className="font-medium text-gray-600">Aadhar:</span> 
                {student.aadharPath ? (
                  <a 
                    href={`http://localhost:5000/uploadaadhar/${student.aadharPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline ml-2"
                  >
                    View Aadhar
                  </a>
                ) : (
                  <span className="text-gray-500 ml-2">Not uploaded</span>
                )}
              </div>
              <div>
                <span className="font-medium text-gray-600">UG Marksheet:</span> 
                {student.ugMarksheetPath ? (
                  <a 
                    href={`http://localhost:5000/uploadugmarks/${student.ugMarksheetPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline ml-2"
                  >
                    View UG Marksheet
                  </a>
                ) : (
                  <span className="text-gray-500 ml-2">Not uploaded</span>
                )}
              </div>
              <div>
                <span className="font-medium text-gray-600">X Marksheet:</span> 
                {student.xMarksheetPath ? (
                  <a 
                    href={`http://localhost:5000/uploadxmarks/${student.xMarksheetPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline ml-2"
                  >
                    View X Marksheet
                  </a>
                ) : (
                  <span className="text-gray-500 ml-2">Not uploaded</span>
                )}
              </div>
              <div>
                <span className="font-medium text-gray-600">XII Marksheet:</span> 
                {student.xiiMarksheetPath ? (
                  <a 
                    href={`http://localhost:5000/uploadxiimarks/${student.xiiMarksheetPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline ml-2"
                  >
                    View XII Marksheet
                  </a>
                ) : (
                  <span className="text-gray-500 ml-2">Not uploaded</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
