import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MediatorAssigned = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const manager = location.state?.manager || {
    name: 'Your Assigned Manager',
    email: 'manager@viya.com',
    phone: 'N/A',
    location: 'N/A',
    experience: 'N/A',
    specialization: 'N/A',
    about: '',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Manager Assigned!</h2>
        <p className="mb-6 text-gray-700">A manager has been assigned to you. You will be guided by:</p>
        <div className="mb-6 text-left">
          <div className="mb-2"><span className="font-semibold">Name:</span> {manager.name}</div>
          <div className="mb-2"><span className="font-semibold">Email:</span> {manager.email}</div>
          <div className="mb-2"><span className="font-semibold">Phone:</span> {manager.phone}</div>
          <div className="mb-2"><span className="font-semibold">Location:</span> {manager.location}</div>
          <div className="mb-2"><span className="font-semibold">Experience:</span> {manager.experience}</div>
          <div className="mb-2"><span className="font-semibold">Specialization:</span> {manager.specialization}</div>
          {manager.about && <div className="mb-2"><span className="font-semibold">About:</span> {manager.about}</div>}
        </div>
        <button
          className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MediatorAssigned; 