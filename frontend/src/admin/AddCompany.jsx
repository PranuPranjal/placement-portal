import React, { useState } from 'react';

const AddCompany = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [cgpaCriteria, setCgpaCriteria] = useState('');
  const [ctc, setCtc] = useState('');
  const [file, setFile] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);

  React.useEffect(() => {
    fetch('/api/branches')
      .then(res => res.json())
      .then(data => setBranches(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('salary', ctc);
    formData.append('cgpaCriteria', cgpaCriteria);
    formData.append('deadline', deadline);
    formData.append('description', description);
    formData.append('allowedBranchIds', JSON.stringify(selectedBranches.map(Number)));
    
    if (file) {
      formData.append('companyFile', file);
    }
    
    const res = await fetch('/api/admin/company', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
        // Don't set Content-Type, let browser set it for FormData
      },
      body: formData
    });
    if (res.ok) {
      alert(`Company ${name} added!`);
      setName(''); setRole(''); setCtc('');
    } else {
      alert('Failed to add company');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">Add New Company</h3>
      <div style={{ marginBottom: 16 }}>
        <label>Allowed Branches:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {branches.map(branch => (
            <label key={branch.id} style={{ minWidth: 110, marginRight: 12 }}>
              <input
                type="checkbox"
                value={branch.id}
                checked={selectedBranches.includes(String(branch.id))}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedBranches([...selectedBranches, String(branch.id)]);
                  } else {
                    setSelectedBranches(selectedBranches.filter(id => id !== String(branch.id)));
                  }
                }}
              />{' '}
              {branch.name}
            </label>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Company Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input placeholder='CGPA Criteria' value={cgpaCriteria} onChange={e => setCgpaCriteria(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input placeholder="Salary" value={ctc} onChange={e => setCtc(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input placeholder="Deadline" type='datetime-local' value={deadline} onChange={e => setDeadline(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company File (Optional)</label>
          <input 
            type="file" 
            onChange={e => setFile(e.target.files[0])} 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors">Add Company</button>
      </form>
    </div>
  );
};

export default AddCompany;
