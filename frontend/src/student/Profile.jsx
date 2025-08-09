import React from 'react';
import { FaUserCircle, FaFilePdf, FaIdCard, FaFileAlt, FaSave, FaTimes, FaUpload } from 'react-icons/fa';

const Profile = () => {
  const [student, setStudent] = React.useState(null);
  const [branches, setBranches] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [cvFile, setCvFile] = React.useState(null);
  const [photoFile, setPhotoFile] = React.useState(null);
  const [aadharFile, setAadharFile] = React.useState(null);
  const [ugMarksheetFile, setUgMarksheetFile] = React.useState(null);
  const [xMarksheetFile, setXMarksheetFile] = React.useState(null);
  const [xiiMarksheetFile, setXiiMarksheetFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [editForm, setEditForm] = React.useState({
    name: '',
    cgpa: '',
    XPercentage: '',
    XIIPercentage: '',
    branchId: ''
  });

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
          name: data.name || '',
          cgpa: data.cgpa?.toString() || '',
          XPercentage: data.XPercentage?.toString() || '',
          XIIPercentage: data.XIIPercentage?.toString() || '',
          branchId: data.branchId?.toString() || ''
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
    if (student) {
      setEditForm({
        name: student.name || '',
        cgpa: student.cgpa?.toString() || '',
        XPercentage: student.XPercentage?.toString() || '',
        XIIPercentage: student.XIIPercentage?.toString() || '',
        branchId: student.branchId?.toString() || ''
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (student) {
      setEditForm({
        name: student.name || '',
        cgpa: student.cgpa?.toString() || '',
        XPercentage: student.XPercentage?.toString() || '',
        XIIPercentage: student.XIIPercentage?.toString() || '',
        branchId: student.branchId?.toString() || ''
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('cgpa', editForm.cgpa);
      formData.append('XPercentage', editForm.XPercentage);
      formData.append('XIIPercentage', editForm.XIIPercentage);
      formData.append('branchId', editForm.branchId);

      if (cvFile) formData.append('cv', cvFile);
      if (photoFile) formData.append('photo', photoFile);
      if (aadharFile) formData.append('aadhar', aadharFile);
      if (ugMarksheetFile) formData.append('ugMarksheet', ugMarksheetFile);
      if (xMarksheetFile) formData.append('xMarksheet', xMarksheetFile);
      if (xiiMarksheetFile) formData.append('xiiMarksheet', xiiMarksheetFile);

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const updatedStudent = await res.json();
        setStudent(updatedStudent);
        setIsEditing(false);
        alert('Profile updated successfully!');
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

  if (!student) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" />
          <span>Loading profile…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 px-6 md:px-8" style={{ marginLeft: '23rem'}}>
      {/* Page heading */}
      <div className="flex items-end justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
          <p className="text-sm text-gray-500">View and manage your personal, academic information and documents</p>
        </div>
      </div>
      {/* Header card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10">
        <div className="flex items-center justify-between min-h-40 pl-6 md:pl-10">
          <div className="flex items-center gap-6">
            {student.photoPath ? (
              <img
                src={`http://localhost:5000/uploadphoto/${student.photoPath}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-contain ring-2 ring-blue-200"
              />
            ) : (
              <FaUserCircle className="w-20 h-20 text-gray-300" />
            )}
            <div className="flex flex-col justify-center h-24">
              <h3 className="text-xl font-semibold text-gray-900">{student.name || 'Your Name'}</h3>
              <p className="text-sm text-gray-600">{student.email}</p>
              <div className="mt-1 text-sm text-gray-700">
                {student.branch ? student.branch.name : 'Branch'} • CGPA: {student.cgpa ?? '-'}
              </div>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-12">
          {/* Edit form sections */}
          <div className="space-y-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10 mt-2">
              <h4 className="text-base font-semibold text-gray-900 mb-6">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={student.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    value={editForm.branchId}
                    onChange={(e) => setEditForm({ ...editForm, branchId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10 mt-2">
              <h4 className="text-base font-semibold text-gray-900 mb-6">Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={editForm.cgpa}
                    onChange={(e) => setEditForm({ ...editForm, cgpa: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">X Percentage</label>
                  <input
                    type="number"
                    value={editForm.XPercentage}
                    onChange={(e) => setEditForm({ ...editForm, XPercentage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">XII Percentage</label>
                  <input
                    type="number"
                    value={editForm.XIIPercentage}
                    onChange={(e) => setEditForm({ ...editForm, XIIPercentage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10 mt-2">
              <h4 className="text-base font-semibold text-gray-900 mb-6">Documents</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CV</label>
                  <label className="w-full flex items-center justify-between px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 cursor-pointer">
                    <span className="text-sm flex items-center gap-2"><FaUpload className="text-gray-400" /> Choose file</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {student.cvPath && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Current: </span>
                      <a
                        href={`http://localhost:5000/uploadcv/${student.cvPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View CV
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    {student.photoPath ? (
                      <img
                        src={`http://localhost:5000/uploadphoto/${student.photoPath}`}
                        alt="Current"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-200"
                      />
                    ) : (
                      <FaUserCircle className="w-16 h-16 text-gray-300" />
                    )}
                    <div className="flex-1">
                      <label className="w-full flex items-center justify-between px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 cursor-pointer">
                        <span className="text-sm flex items-center gap-2"><FaUpload className="text-gray-400" /> Choose image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPhotoFile(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                      <small className="text-gray-500">JPEG, PNG, or JPG</small>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar</label>
                    <label className="w-full flex items-center justify-between px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 cursor-pointer">
                      <span className="text-sm flex items-center gap-2"><FaUpload className="text-gray-400" /> Choose file</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setAadharFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {student.aadharPath && (
                      <div className="mt-2 text-sm">
                        <a
                          href={`http://localhost:5000/uploadaadhar/${student.aadharPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View Aadhar
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UG Marksheet</label>
                    <label className="w-full flex items-center justify-between px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 cursor-pointer">
                      <span className="text-sm flex items-center gap-2"><FaUpload className="text-gray-400" /> Choose file</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setUgMarksheetFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {student.ugMarksheetPath && (
                      <div className="mt-2 text-sm">
                        <a
                          href={`http://localhost:5000/uploadugmarks/${student.ugMarksheetPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View UG Marksheet
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">X Marksheet</label>
                    <label className="w-full flex items-center justify-between px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 cursor-pointer">
                      <span className="text-sm flex items-center gap-2"><FaUpload className="text-gray-400" /> Choose file</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setXMarksheetFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {student.xMarksheetPath && (
                      <div className="mt-2 text-sm">
                        <a
                          href={`http://localhost:5000/uploadxmarks/${student.xMarksheetPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View X Marksheet
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">XII Marksheet</label>
                    <label className="w-full flex items-center justify-between px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 cursor-pointer">
                      <span className="text-sm flex items-center gap-2"><FaUpload className="text-gray-400" /> Choose file</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setXiiMarksheetFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {student.xiiMarksheetPath && (
                      <div className="mt-2 text-sm">
                        <a
                          href={`http://localhost:5000/uploadxiimarks/${student.xiiMarksheetPath}`}
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

          {/* Bottom actions */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 inline-flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? 'Saving…' : (<><FaSave /> Save Changes</>)}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Details cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
              <h4 className="text-base font-semibold text-gray-900 mb-6">Personal Details</h4>
              <dl className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">{student.name || '-'}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">{student.email || '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Branch</dt>
                  <dd className="font-medium text-gray-900">{student.branch ? student.branch.name : '-'}</dd>
                </div>
              </dl>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
              <h4 className="text-base font-semibold text-gray-900 mb-6">Academic Details</h4>
              <dl className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-gray-500">CGPA</dt>
                  <dd className="font-medium text-gray-900">{student.cgpa ?? '-'}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-gray-500">X Percentage</dt>
                  <dd className="font-medium text-gray-900">{student.XPercentage ?? '-'}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-gray-500">XII Percentage</dt>
                  <dd className="font-medium text-gray-900">{student.XIIPercentage ?? '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Roll / Registration</dt>
                  <dd className="font-medium text-gray-900">{student.rollNumber || '-'} / {student.registrationNumber || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
            <h4 className="text-base font-semibold text-gray-900 mb-6">Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              {/* CV */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaFilePdf className="text-red-500" />
                  <div>
                    <div className="font-medium text-gray-800">CV</div>
                    <div className="text-xs text-gray-500">PDF/DOC/DOCX</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {student.cvPath ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Uploaded</span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">Not uploaded</span>
                  )}
                  {student.cvPath && (
                    <a
                      href={`http://localhost:5000/uploadcv/${student.cvPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>

              {/* Aadhar */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-indigo-500" />
                  <div>
                    <div className="font-medium text-gray-800">Aadhar</div>
                    <div className="text-xs text-gray-500">PDF/DOC/DOCX</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {student.aadharPath ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Uploaded</span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">Not uploaded</span>
                  )}
                  {student.aadharPath && (
                    <a
                      href={`http://localhost:5000/uploadaadhar/${student.aadharPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>

              {/* UG Marksheet */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-emerald-600" />
                  <div>
                    <div className="font-medium text-gray-800">UG Marksheet</div>
                    <div className="text-xs text-gray-500">PDF/DOC/DOCX</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {student.ugMarksheetPath ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Uploaded</span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">Not uploaded</span>
                  )}
                  {student.ugMarksheetPath && (
                    <a
                      href={`http://localhost:5000/uploadugmarks/${student.ugMarksheetPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>

              {/* X Marksheet */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-amber-600" />
                  <div>
                    <div className="font-medium text-gray-800">X Marksheet</div>
                    <div className="text-xs text-gray-500">PDF/DOC/DOCX</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {student.xMarksheetPath ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Uploaded</span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">Not uploaded</span>
                  )}
                  {student.xMarksheetPath && (
                    <a
                      href={`http://localhost:5000/uploadxmarks/${student.xMarksheetPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>

              {/* XII Marksheet */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-800">XII Marksheet</div>
                    <div className="text-xs text-gray-500">PDF/DOC/DOCX</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {student.xiiMarksheetPath ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Uploaded</span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">Not uploaded</span>
                  )}
                  {student.xiiMarksheetPath && (
                    <a
                      href={`http://localhost:5000/uploadxiimarks/${student.xiiMarksheetPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View
                    </a>
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

export default Profile;
