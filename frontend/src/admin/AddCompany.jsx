import React, { useState } from 'react';

const AddCompany = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(['']);
  const [password, setPassword] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [cgpaCriteria, setCgpaCriteria] = useState('');
  const [ctc, setCtc] = useState('');
  const [file, setFile] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);

  // function toLocalISOString(datetimeLocal) {
  //   const [datePart, timePart] = datetimeLocal.split('T');
  //   const [year, month, day] = datePart.split('-');
  //   const [hour, minute] = timePart.split(':');
  //   const localDate = new Date(year, month - 1, day, hour, minute);
  //   return localDate.toISOString();
  // }

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
    formData.append('role', role.join(','));
    formData.append('password', password);
    formData.append('salary', ctc);
    formData.append('cgpaCriteria', cgpaCriteria);
    // formData.append('deadline', toLocalISOString(deadline));
    formData.append('deadline', deadline);
    formData.append('description', description);
    formData.append('allowedBranchIds', JSON.stringify(selectedBranches.map(Number)));
    
    if (file) {
      formData.append('companyFile', file);
    }
    
    console.log('Sending request to backend with data:', {
      name, role, salary: ctc, cgpaCriteria, deadline, description,
      allowedBranches: selectedBranches, password: password ? '***' : 'undefined'
    });
    
    const res = await fetch('http://localhost:5000/api/admin/company', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    if (res.ok) {
      const responseData = await res.json();
      console.log('Success response:', responseData);
      alert(`Company ${name} added! User created: ${responseData.user?.email}`);
      setName(''); setRole(['']); setCtc(''); setPassword('');
    } else {
      const errorData = await res.text();
      console.error('Error response:', errorData);
      alert('Failed to add company: ' + errorData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto" style={{ marginLeft: '15rem'}}>
      <h3 className="text-lg font-semibold text-blue-700 mb-6">Add New Company</h3>

      {/* Allowed Branches */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allowed Branches
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {branches.map(branch => {
            const idStr = String(branch.id);
            const checked = selectedBranches.includes(idStr);
            return (
              <label
                key={branch.id}
                className={`flex items-center cursor-pointer rounded-lg px-3 py-2 border-2 transition-all duration-200 hover:shadow-sm ${
                  checked
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontSize: '1.05rem' }}
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '8px'
                  }}
                  value={idStr}
                  checked={checked}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedBranches([...selectedBranches, idStr]);
                    } else {
                      setSelectedBranches(selectedBranches.filter(id => id !== idStr));
                    }
                  }}
                />
                <span className="font-medium">{branch.name}</span>
              </label>
            );
          })}
        </div>
      </div>
      <br />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input 
              placeholder="Name of the company"
              value={name}
              onChange={e => setName(e.target.value)}
              required 
              autoComplete="organization"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password"
              placeholder="Set company login password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
        </div>

        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
          <div className="space-y-2">
            {role.map((r, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'stretch', gap: '8px' }}>
                <input
                  placeholder={`Role ${index + 1}`}
                  value={r}
                  onChange={e => {
                    const newRole = [...role];
                    newRole[index] = e.target.value;
                    setRole(newRole);
                  }}
                  required
                  className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ 
                    width: '300px', 
                    height: '40px',
                    padding: '0 16px',
                    fontSize: '14px'
                  }}
                />
                {role.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setRole(role.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded border border-red-300"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: '0',
                      padding: '0',
                      margin: '0'
                    }}
                    aria-label="Remove role"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRole([...role, ''])}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold px-4 py-2.5 rounded-lg shadow-md transition-colors w-fit"
          >
            Add Role
          </button>
        </div>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CGPA Criteria</label>
            <input 
              type="number" step="0.01" min="0" max="10"
              placeholder="Minimum CGPA Required"
              value={cgpaCriteria}
              onChange={e => setCgpaCriteria(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTC</label>
            <input 
              type="number" step="0.01" min="0"
              placeholder="CTC in LPA"
              value={ctc}
              onChange={e => setCtc(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input 
              type='datetime-local' 
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company File (Optional)</label>
            <input 
              type="file" 
              onChange={e => setFile(e.target.files[0])} 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            rows={4}
            placeholder="Brief job description, responsibilities, requirements..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
        </div>

        <button 
          type="submit" 
          className="inline-flex items-center bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md transition-colors w-fit"
        >
          Add Company
        </button>
      </form>
    </div>
  );
};

export default AddCompany;
