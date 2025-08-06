import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const body = {
        name,
        email,
        password,
        role,
        ...(role === 'student' ? { branch, cgpa } : {})
      };
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Signup successful! Please login.');
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafc' }}>
      <div className="card" style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', color: '#2563eb', marginBottom: 24 }}>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Role:</label>
            <select value={role} onChange={e => setRole(e.target.value)} required>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Name:</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" />
          </div>
          {role === 'student' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label>Branch:</label>
                <input value={branch} onChange={e => setBranch(e.target.value)} required placeholder="Branch" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>CGPA:</label>
                <input type="number" step="0.01" value={cgpa} onChange={e => setCgpa(e.target.value)} required placeholder="CGPA" min="0" max="10" />
              </div>
            </>
          )}
          {error && <div className="text-center" style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          Already have an account? <a href="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
