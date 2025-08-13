import React from 'react';
import { FaFilePdf, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EligibleCompanies = () => {
  const [profile, setProfile] = React.useState(null);
  const [companies, setCompanies] = React.useState([]);
  const [appliedCompanies, setAppliedCompanies] = React.useState(new Set());
  const [selectedRole, setSelectedRole] = React.useState('');
  const [loading, setLoading] = React.useState(false); // general loading
  const [showApplyScreen, setShowApplyScreen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [cvFile, setCvFile] = React.useState(null);
  const [currentCv, setCurrentCv] = React.useState(null);
  const [applyingIds, setApplyingIds] = React.useState(new Set()); // per-company applying status

  const navigate = useNavigate();

  // Fetch everything once on mount
  React.useEffect(() => {
    (async () => {
      await fetchProfile();
      await fetchCompanies();
      await fetchAppliedCompanies();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Fetch helpers ---
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        if (data.cvPath) setCurrentCv(data.cvPath);
      } else {
        console.warn('Profile fetch returned non-OK:', data);
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCompanies(Array.isArray(data) ? data : []);
      } else {
        console.error('Companies API error:', data);
      }
    } catch (err) {
      console.error('Failed to fetch companies', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/applied', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setAppliedCompanies(new Set(data));
      } else {
        console.warn('Applied companies fetch non-OK or invalid payload', data);
      }
    } catch (err) {
      console.error('Failed to fetch applied companies', err);
    }
  };

  // --- Utility ---
  const isProfileComplete = (p) => {
    if (!p) return false;
    const requiredFields = [
      'name', 'cgpa', 'XPercentage', 'XIIPercentage', 'branchId',
      'cvPath', 'rollNumber', 'registrationNumber', 'photoPath',
      'ugMarksheetPath', 'xMarksheetPath', 'xiiMarksheetPath'
    ];
    return requiredFields.every(field => p[field] !== null && p[field] !== undefined && p[field] !== '');
  };

  const openApplicationScreen = (company) => {
    if (company.deadline && new Date(company.deadline) < new Date()) {
      alert('The application deadline for this company has passed.');
      return;
    }
    if (!profile) {
      alert('Fetching profile — please try again in a moment.');
      fetchProfile();
      return;
    }
    if (!isProfileComplete(profile)) {
      alert('Please complete your profile before applying.');
      navigate('/student/profile');
      return;
    }

    setSelectedCompany(company);
    setSelectedRole(''); // reset
    setCvFile(null);
    setShowApplyScreen(true); // hide list, show apply page
  };

  const closeApplicationScreen = () => {
    setShowApplyScreen(false);
    setSelectedCompany(null);
    setSelectedRole('');
    setCvFile(null);
  };

  // --- Apply (with optional CV upload and selectedRole) ---
  const applyToCompany = async () => {
    if (!selectedCompany) return;
    if (!selectedRole) {
      alert('Please select a role before applying.');
      return;
    }

    const companyId = selectedCompany.id;
    // mark applying
    setApplyingIds(prev => {
      const next = new Set(prev);
      next.add(companyId);
      return next;
    });

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      if (cvFile) formData.append('cv', cvFile);
      if (profile.XPercentage) formData.append('xpercentage', profile.XPercentage);
      if (profile.XIIPercentage) formData.append('xiipercentage', profile.XIIPercentage);
      if (profile.rollNumber) formData.append('rollNumber', profile.rollNumber);
      if (profile.registrationNumber) formData.append('registrationNumber', profile.registrationNumber);

      const res = await fetch(`http://localhost:5000/api/student/apply/${companyId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, // DO NOT set Content-Type for FormData
        body: formData
      });
      if (res.ok) {
        // update applied list
        setAppliedCompanies(prev => {
          const next = new Set(prev);
          next.add(companyId);
          return next;
        });
        alert('Applied successfully!');
        // return to list view (if you want to stay on apply page remove this)
        closeApplicationScreen();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to apply');
      }
    } catch (err) {
      console.error('Network error while applying:', err);
      alert('Network error');
    } finally {
      setApplyingIds(prev => {
        const next = new Set(prev);
        next.delete(companyId);
        return next;
      });
    }
  };

  // Optional: quick apply without role selection (not used — kept for reference)
  const handleQuickApply = async (companyId) => {
    setApplyingIds(prev => {
      const next = new Set(prev);
      next.add(companyId);
      return next;
    });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/student/apply/${companyId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ quick: true })
      });
      if (res.ok) {
        setAppliedCompanies(prev => {
          const next = new Set(prev);
          next.add(companyId);
          return next;
        });
        alert('Applied (quick)!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to apply');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setApplyingIds(prev => {
        const next = new Set(prev);
        next.delete(companyId);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl shadow p-6 relative">
      {!showApplyScreen ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-700">Eligible Companies</h3>
            {loading && <span className="text-sm text-gray-500">Loading...</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">CTC (in LPA)</th>
                  <th className="px-4 py-2 text-left">Deadline</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">File</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="px-4 py-2 font-medium">{c.name}</td>
                    <td className="px-4 py-2">{c.role}</td>
                    <td className="px-4 py-2">{c.salary ?? c.ctc ?? '-'}</td>
                    <td className="px-4 py-2">
                      {c.deadline ? new Date(c.deadline).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : '-'}
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate">{c.description}</td>
                    <td className="px-4 py-2">
                      {c.filePath ? (
                        <a
                          href={`http://localhost:5000/uploads/${c.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center"
                        >
                          <FaFilePdf className="mr-2" /> View
                        </a>
                      ) : (
                        <span className="text-gray-500">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {appliedCompanies.has(c.id) ? (
                        <span className="text-green-600 font-medium">Applied</span>
                      ) : new Date(c.deadline) < new Date() ? (
                        <span className="text-red-500 font-medium">Deadline Passed</span>
                      ) : (
                        <button
                          onClick={() => openApplicationScreen(c)}
                          className="px-3 py-1 bg-blue-600 text-white w-15 h-8 rounded hover:cursor-pointer hover:bg-blue-700"
                          disabled={applyingIds.has(c.id)}
                        >
                          {applyingIds.has(c.id) ? 'Processing...' : 'Apply'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      No companies available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Apply screen (replaces the list)
        selectedCompany && (
          <div className="flex flex-col gap-6 rounded-xl shadow p-6 relative max-h-screen">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-blue-700">Apply to {selectedCompany.name}</h3>
                <p className="text-sm text-gray-300 mt-1">{selectedCompany.description}</p>
              </div>
              <button
                onClick={closeApplicationScreen}
                className="text-white hover:cursor-pointer hover:text-red-700 p-2 rounded"
                title="Close"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <div className='flex flex-col gap-2'>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Select Role:</label>
                  <div className="flex flex-col gap-2">
                    {String(selectedCompany.role || '')
                      .split(',')
                      .map((r, i) => {
                        const roleVal = r.trim();
                        if (!roleVal) return null;
                        return (
                          <label
                            key={i}
                            className={`flex items-center justify-center p-3 w-32 h-10 max-w-full rounded-lg border transition-all duration-150 cursor-pointer 
                              ${ selectedRole === roleVal
                                ? 'bg-gray-800 border-blue-300 text-blue-800 shadow-sm'
                                : 'border-blue-700 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="selectedRole"
                              value={roleVal}
                              checked={selectedRole === roleVal}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="hidden"
                            />
                            <span className="text-sm text-white pl-5">{roleVal}</span>
                          </label>
                        );
                      })}
                    </div>
                </div>
                <br />
                <p className="text-base text-gray-200 mt-4">
                  CTC: <span className="font-semibold">{selectedCompany.salary ?? selectedCompany.ctc ?? '-' } LPA</span>
                </p>
                <p className="text-base text-gray-500">
                  Deadline: <span className="font-semibold">{selectedCompany.deadline ? new Date(selectedCompany.deadline).toLocaleDateString() : '-'}</span>
                </p>
              </div>
              <div className="col-span-1 p-4 rounded-lg border flex flex-col gap-4">
                <div className='flex flex-col gap-2'>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Current CV:</label>
                  {currentCv ? (
                    <a
                      href={`http://localhost:5000/uploadcv/${currentCv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-800 text-l flex items-center gap-2"
                    >
                      <FaFilePdf /> View Current CV
                    </a>
                  ) : (
                    <div className="text-gray-500 text-sm">No CV uploaded</div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <label className="block text-sm font-medium text-blue-500 mb-2">Upload New CV (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 hover:cursor-pointer focus:ring-blue-400"
                  />
                  <small className="text-gray-500 block mt-1">Leave empty to use current CV</small>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={applyToCompany}
                disabled={applyingIds.has(selectedCompany.id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:cursor-pointer hover:bg-blue-700 disabled:opacity-60"
              >
                {applyingIds.has(selectedCompany.id) ? 'Applying…' : 'Apply Now'}
              </button>

              <button
                onClick={closeApplicationScreen}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:cursor-pointer hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default EligibleCompanies;