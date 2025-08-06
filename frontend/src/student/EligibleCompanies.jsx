import React from 'react';

const EligibleCompanies = () => {
  const [companies, setCompanies] = React.useState([]);
  const [appliedCompanies, setAppliedCompanies] = React.useState(new Set());
  const [loading, setLoading] = React.useState({});
  React.useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      console.log('Making request to /api/student/companies');
      
      const res = await fetch('/api/student/companies', {
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
    };
    fetchCompanies();
  }, []);

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
                      onClick={() => handleApply(c.id)}
                      disabled={loading[c.id]}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading[c.id] ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EligibleCompanies;
