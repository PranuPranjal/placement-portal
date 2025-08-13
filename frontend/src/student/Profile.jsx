import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaFilePdf, FaIdCard, FaFileAlt, FaSave, FaTimes, FaUpload, FaEdit } from 'react-icons/fa';

// API call functions
const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/student/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

const fetchBranches = async () => {
  const res = await fetch('http://localhost:5000/api/branches');
  if (!res.ok) throw new Error('Failed to fetch branches');
  return res.json();
};

const updateProfile = async (formData) => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/student/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update profile');
    }
    return res.json();
};

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [branches, setBranches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileData, branchesData] = await Promise.all([fetchProfile(), fetchBranches()]);
        setStudent(profileData);
        setBranches(branchesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async (formData) => {
    try {
      const updatedStudent = await updateProfile(formData);
      setStudent(updatedStudent);
      setIsEditing(false);
      alert('Profile updated successfully!');
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div style={{ textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '1280px', margin: 'auto', padding: '1rem' }}>
      {isEditing ? (
        <ProfileForm
          student={student}
          branches={branches}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <ProfileView student={student} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
};

const ProfileView = ({ student, onEdit }) => (
  <div className='bg-white rounded-xl shadow p-6'>
    <div style={{ padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {student.photoPath ? (
                <img
                    src={`http://localhost:5000/uploadphoto/${student.photoPath}`}
                    alt="Profile"
                    style={{ width: '8rem', height: '8rem', borderRadius: '9999px', objectFit: 'contain', border: '4px solid #bfdbfe', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                />
            ) : (
                <FaUserCircle style={{ width: '8rem', height: '8rem', color: '#d1d5db' }} />
            )}
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#fff' }}>{student.name || 'Your Name'}</h1>
                <p style={{ fontSize: '1.125rem', color: '#6b7280', marginTop: '0.25rem' }}>{student.email}</p>
                <p style={{ fontSize: '1rem', color: '#3b82f6', fontWeight: '600', marginTop: '0.5rem' }}>
                    {student.branch ? student.branch.name : 'Branch'} • CGPA: {student.cgpa ?? '-'}
                </p>
            </div>
        </div>
        <button
            className='hover:cursor-pointer hover:bg-blue-800'
            onClick={onEdit}
            style={{hover: 'cursor-pointer', position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: '#3b82f6', color: 'white', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
            <FaEdit />
            <span>Edit Profile</span>
        </button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid #272829ff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1.5rem' }}>Personal Details</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.125rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>Name:</span>
                    <span style={{ color: '#3b82f6' }}>{student.name || '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>Email:</span>
                    <span style={{ color: '#3b82f6' }}>{student.email || '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>Branch:</span>
                    <span style={{ color: '#3b82f6' }}>{student.branch ? student.branch.name : '-'}</span>
                </li>
            </ul>
        </div>
        <div style={{ padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1.5rem' }}>Academic Details</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.125rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>CGPA:</span>
                    <span style={{ color: '#3b82f6' }}>{student.cgpa ?? '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>X %:</span>
                    <span style={{ color: '#3b82f6' }}>{student.XPercentage ?? '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>XII %:</span>
                    <span style={{ color: '#3b82f6' }}>{student.XIIPercentage ?? '-'}</span>
                </li>
                 <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: '#fff' }}>Roll / Reg:</span>
                  <span style={{ color: '#3b82f6' }}>{student.rollNumber || '-'} / {student.registrationNumber || '-'}</span>
                </li>
            </ul>
        </div>
    </div>

    <div style={{ padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1.5rem' }}>Documents</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <DocumentItem icon={<FaFilePdf style={{ color: '#ef4444', fontSize: '1.5rem' }} />} label="CV" path={student.cvPath} type="uploadcv" />
            <DocumentItem icon={<FaIdCard style={{ color: '#6366f1', fontSize: '1.5rem' }} />} label="Aadhar" path={student.aadharPath} type="uploadaadhar" />
            <DocumentItem icon={<FaFileAlt style={{ color: '#10b981', fontSize: '1.5rem' }} />} label="UG Marksheet" path={student.ugMarksheetPath} type="uploadugmarks" />
            <DocumentItem icon={<FaFileAlt style={{ color: '#f59e0b', fontSize: '1.5rem' }} />} label="X Marksheet" path={student.xMarksheetPath} type="uploadxmarks" />
            <DocumentItem icon={<FaFileAlt style={{ color: '#8b5cf6', fontSize: '1.5rem' }} />} label="XII Marksheet" path={student.xiiMarksheetPath} type="uploadxiimarks" />
        </div>
    </div>
  </div>
);

const DocumentItem = ({ icon, label, path, type }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {icon}
            <span style={{ fontWeight: '600', color: '#374151' }}>{label}</span>
        </div>
        {path ? (
            <a href={`http://localhost:5000/${type}/${path}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                View
            </a>
        ) : (
            <span style={{ color: '#9ca3af' }}>Not Uploaded</span>
        )}
    </div>
);

const ProfileForm = ({ student, branches, onCancel, onSave }) => {
    const [formData, setFormData] = useState({
        name: student.name || '',
        cgpa: student.cgpa?.toString() || '',
        XPercentage: student.XPercentage?.toString() || '',
        XIIPercentage: student.XIIPercentage?.toString() || '',
        branchId: student.branchId?.toString() || '',
    });
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: inputFiles } = e.target;
        setFiles(prev => ({ ...prev, [name]: inputFiles[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        for (const key in files) {
            if (files[key]) {
                data.append(key, files[key]);
            }
        }
        await onSave(data);
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className='bg-white rounded-xl shadow p-6' style={{ padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1.5rem' }}>Edit Personal Information</h2>
                <div style={{ color: 'white', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label className='text-white'>Name</label>
                        <InputField name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className='text-white'>Email</label>
                        <InputField className='hover:cursor-not-allowed' name="email" value={student.email} disabled />
                    </div>
                    <div>
                    <label className="text-white">Branch</label>
                    <select
                        name="branchId"
                        value={formData.branchId}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                    >
                        {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-xl shadow p-6' style={{ padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1.5rem' }}>Edit Academic Information</h2>
                <div
                    style={{
                        color: 'white',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}
                    >
                    <div>
                        <label className="text-white">CGPA</label>
                        <InputField
                        name="cgpa"
                        type="number"
                        value={formData.cgpa}
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="text-white">X Percentage</label>
                        <InputField
                        name="XPercentage"
                        type="number"
                        value={formData.XPercentage}
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="text-white">XII Percentage</label>
                        <InputField
                        name="XIIPercentage"
                        type="number"
                        value={formData.XIIPercentage}
                        onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-xl shadow p-6' style={{ padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1.5rem' }}>Upload Documents</h2>
                <div style={{ color: 'white', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label className="text-white">CV</label>
                        <FileInputField
                        name="cv"
                        onChange={handleFileChange}
                        currentPath={student.cvPath}
                        type="uploadcv"
                        />
                    </div>

                    <div>
                        <label className="text-white">Photo</label>
                        <FileInputField
                        name="photo"
                        onChange={handleFileChange}
                        currentPath={student.photoPath}
                        type="uploadphoto"
                        accept="image/*"
                        />
                    </div>

                    <div>
                        <label className="text-white">Aadhar</label>
                        <FileInputField
                        name="aadhar"
                        onChange={handleFileChange}
                        currentPath={student.aadharPath}
                        type="uploadaadhar"
                        />
                    </div>

                    <div>
                        <label className="text-white">UG Marksheet</label>
                        <FileInputField
                        name="ugMarksheet"
                        onChange={handleFileChange}
                        currentPath={student.ugMarksheetPath}
                        type="uploadugmarks"
                        />
                    </div>

                    <div>
                        <label className="text-white">X Marksheet</label>
                        <FileInputField
                        name="xMarksheet"
                        onChange={handleFileChange}
                        currentPath={student.xMarksheetPath}
                        type="uploadxmarks"
                        />
                    </div>

                    <div>
                        <label className="text-white">XII Marksheet</label>
                        <FileInputField
                        name="xiiMarksheet"
                        onChange={handleFileChange}
                        currentPath={student.xiiMarksheetPath}
                        type="uploadxiimarks"
                        />
                    </div>                
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className='hover:cursor-pointer hover:bg-blue-800' type="button" onClick={onCancel} style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: '#e5e7eb', color: '#1f2937', borderRadius: '9999px' }}>Cancel</button>
                <button className='hover:cursor-pointer hover:bg-blue-800' type="submit" disabled={loading} style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '9999px' }}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

const InputField = ({ label, ...props }) => (
    <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>{label}</label>
        <input {...props} style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
    </div>
);

const FileInputField = ({ label, name, onChange, currentPath, type, accept = ".pdf,.doc,.docx" }) => {
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
    onChange(e);
  };

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <label className="flex-1 flex items-center justify-center gap-2 p-2 bg-white text-blue-600 border border-blue-600 rounded-md shadow-sm cursor-pointer hover:bg-blue-50">
          <FaUpload />
          <span className="truncate">{fileName || "Select a file"}</span>
          <input
            type="file"
            name={name}
            className="hidden"
            onChange={handleChange}
            accept={accept}
          />
        </label>
        {currentPath && !fileName && (
          <a
            href={`http://localhost:5000/${type}/${currentPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline truncate"
          >
            View Current
          </a>
        )}
      </div>
    </div>
  );
};

export default Profile;
