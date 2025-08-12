import React from 'react';

const AppliedCompanies = () => {
  const [applied, setApplied] = React.useState([]);
  React.useEffect(() => {
    const fetchApplied = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/student/applied', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setApplied(data);
    };
    fetchApplied();
  }, []);
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">Applied Companies</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Salary</th>
              <th className="px-4 py-2 text-left">Deadline</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Company File</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {applied.map((c, i) => (
              <tr key={i} className="border-b">
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
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-500">No file</span>
                  )}
                </td>
                <td className="px-4 py-2">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppliedCompanies;
