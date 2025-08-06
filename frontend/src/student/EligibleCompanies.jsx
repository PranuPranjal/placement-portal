import React from 'react';

const EligibleCompanies = () => {
  const [companies, setCompanies] = React.useState([]);
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
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr key={i} className="border-b hover:bg-blue-50">
                <td className="px-4 py-2 font-medium">{c.name}</td>
                <td className="px-4 py-2">{c.role}</td>
                <td className="px-4 py-2">{c.salary || c.ctc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EligibleCompanies;
