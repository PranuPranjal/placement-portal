import React from 'react';
import { FaUserCircle, FaFilePdf, FaIdCard, FaFileAlt, FaTimes } from 'react-icons/fa';
import { MdOutlineOpenInFull, MdOutlineCloseFullscreen } from "react-icons/md";

// A simple icon component for document links
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const StudentsProfile = () => {
  const [students, setStudents] = React.useState([]);
  const [filteredStudents, setFilteredStudents] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [selectedBranch, setSelectedBranch] = React.useState('All');
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [showProfile, setShowProfile] = React.useState(false);
  const [isStudentListVisible, setIsStudentListVisible] = React.useState(true);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStudents(data);
          setFilteredStudents(data);
          const uniqueBranches = Array.from(
            new Set(data.map((s) => s.branch?.name).filter(Boolean))
          );
          setBranches(uniqueBranches);
        } else {
          console.error("Failed to fetch students:", data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
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

  const viewStudentProfile = (student) => {
    window.scrollTo(0, 0);
    setSelectedStudent(student);
    setShowProfile(true);
    setIsStudentListVisible(false);
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedStudent(null);
    setIsStudentListVisible(true);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 relative min-h-screen">
      {showProfile && selectedStudent && (
        <ProfileOverlay student={selectedStudent} onCloseProfile={closeProfile} />
      )}
     {isStudentListVisible && (
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Students Profile</h3>
          <div className="mb-4">
            <label className="mr-2 font-medium text-gray-700">Filter by Branch:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="All">All</option>
              {branches.map((branch, i) => (
                <option key={i} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Branch</th>
                    <th className="px-4 py-2 text-left">CGPA</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-2 font-medium">{s.name}</td>
                      <td className="px-4 py-2">{s.email}</td>
                      <td className="px-4 py-2">{s.branch?.name || ''}</td>
                      <td className="px-4 py-2">{s.cgpa}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => viewStudentProfile(s)}
                          className="text-blue-600 hover:text-blue-800 hover:cursor-pointer font-bold"
                        >
                          View <MdOutlineOpenInFull size={20} className="inline-block ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProfileOverlay = ({ student, onCloseProfile }) => (
    <div className="absolute inset-0 rounded-xl p-6 z-20" style={{ maxHeight: '95vh', background: 'transparent', padding: '1.5rem', overflowY: 'auto' }}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-600">Student Profile</h3>
            <button onClick={onCloseProfile} className="text-gray-400 hover:cursor-pointer hover:text-red-600">
                <FaTimes size={24} />
            </button>
        </div>
        <ProfileView student={student} />
    </div>
);

const ProfileView = ({ student }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', borderRadius: '0.5rem' }}>
    <div style={{ padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {student.photoPath ? (
            <img
                src={`http://localhost:5000/uploadphoto/${student.photoPath}`}
                alt="Profile"
                style={{ width: '6rem', height: '6rem', borderRadius: '9999px', objectFit: 'contain' }}
            />
        ) : (
            <FaUserCircle style={{ width: '6rem', height: '6rem', color: '#d1d5db' }} />
        )}
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{student.name || 'Your Name'}</h1>
            <p style={{ fontSize: '1rem', color: 'white' }}>{student.email}</p>
            <p style={{ fontSize: '0.875rem', color: 'white', fontWeight: '600', marginTop: '0.25rem' }}>
                {student.branch ? student.branch.name : 'Branch'} • CGPA: {student.cgpa ?? '-'}
            </p>
        </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        <div style={{ background: 'transparent', border: '1px solid #4c4a4aff', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1d75f1ff', marginBottom: '1rem' }}>Personal & Academic Details</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>Name:</span>
                    <span style={{ color: '#fff' }}>{student.name || '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>Email:</span>
                    <span style={{ color: '#fff' }}>{student.email || '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>Branch:</span>
                    <span style={{ color: '#fff' }}>{student.branch ? student.branch.name : '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>CGPA:</span>
                    <span style={{ color: '#fff' }}>{student.cgpa ?? '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>X %:</span>
                    <span style={{ color: '#fff' }}>{student.XPercentage ?? '-'}</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#fff' }}>XII %:</span>
                    <span style={{ color: '#fff' }}>{student.XIIPercentage ?? '-'}</span>
                </li>
                 <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: '#fff' }}>Roll / Reg:</span>
                  <span style={{ color: '#fff' }}>{student.rollNumber || '-'} / {student.registrationNumber || '-'}</span>
                </li>
            </ul>
        </div>
        <div style={{ padding: '1.5rem', background: 'transparent', border: '1px solid #4c4a4aff', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1d75f1ff', marginBottom: '1rem' }}>Documents</h2>
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

export default StudentsProfile;