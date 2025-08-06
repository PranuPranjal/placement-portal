import React from 'react';

const StudentsProfile = () => {
  const [students, setStudents] = React.useState([]);
  React.useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setStudents(data);
    };
    fetchStudents();
  }, []);
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">Students Profile</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Branch</th>
              <th className="px-4 py-2 text-left">CGPA</th>
              <th className="px-4 py-2 text-left">Photo</th>
              <th className="px-4 py-2 text-left">CV</th>
              <th className="px-4 py-2 text-left">UG Marksheet</th>
              <th className="px-4 py-2 text-left">X Marksheet</th>
              <th className="px-4 py-2 text-left">XII Marksheet</th>
              

            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-b hover:bg-blue-50">
                <td className="px-4 py-2 font-medium">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.branch ? s.branch.name : ''}</td>
                <td className="px-4 py-2">{s.cgpa}</td>
                <td className="px-4 py-2">
                  {s.photoPath ? (
                    <a 
                      href={`http://localhost:5000/uploadphoto/${s.photoPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-500">No photo</span>
                  )}
                </td>
                <td className="px-4 py-2">{s.cvPath ? (
                  <a 
                    href={`http://localhost:5000/uploadcv/${s.cvPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-gray-500">No CV</span>
                )}</td>
                <td className="px-4 py-2">{s.ugMarksheetPath ? (
                  <a 
                    href={`http://localhost:5000/uploadugmarks/${s.ugMarksheetPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-gray-500">No UG Marksheet</span>
                )}</td>
                <td className="px-4 py-2">{s.xMarksheetPath ? (
                  <a 
                    href={`http://localhost:5000/uploadxmarks/${s.xMarksheetPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-gray-500">No X Marksheet</span>
                )}</td>
                <td className="px-4 py-2">{s.xiiMarksheetPath ? (
                  <a 
                    href={`http://localhost:5000/uploadxiimarks/${s.xiiMarksheetPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-gray-500">No XII Marksheet</span>
                )}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsProfile;
