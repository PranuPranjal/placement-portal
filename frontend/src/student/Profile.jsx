import React from 'react';

const Profile = () => {
  const [student, setStudent] = React.useState(null);
  React.useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setStudent(data);
    };
    fetchProfile();
  }, []);
  if (!student) return <div className="text-center text-gray-500">Loading...</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">Profile</h3>
      <div className="space-y-2">
        <div><span className="font-medium text-gray-700">Name:</span> {student.name}</div>
        <div><span className="font-medium text-gray-700">Email:</span> {student.email}</div>
        <div><span className="font-medium text-gray-700">Branch:</span> {student.branch ? student.branch.name : ''}</div>
        <div><span className="font-medium text-gray-700">CGPA:</span> {student.cgpa}</div>
      </div>
    </div>
  );
};

export default Profile;
