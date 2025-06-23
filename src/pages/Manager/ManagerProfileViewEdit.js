import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultProfile = {
  name: '',
  email: '',
  phone: '',
  experience: '',
  specialization: '',
  location: '',
  about: '',
  commissionRate: '',
  languages: [],
  certifications: []
};

const ManagerProfileViewEdit = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('managerProfile');
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('managerProfile', JSON.stringify(profile));
    setEditMode(false);
    alert('Profile updated!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manager Profile</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          {!editMode ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div><b>Name:</b> {profile.name || '-'}</div>
                <div><b>Email:</b> {profile.email || '-'}</div>
                <div><b>Phone:</b> {profile.phone || '-'}</div>
                <div><b>Location:</b> {profile.location || '-'}</div>
                <div><b>Experience:</b> {profile.experience || '-'}</div>
                <div><b>Specialization:</b> {profile.specialization || '-'}</div>
                <div><b>Commission Rate:</b> {profile.commissionRate || '-'}</div>
              </div>
              <div className="mb-6"><b>About:</b> {profile.about || '-'}</div>
              <button
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" name="phone" value={profile.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input type="text" name="location" value={profile.location} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input type="number" name="experience" value={profile.experience} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <input type="text" name="specialization" value={profile.specialization} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate</label>
                  <input type="number" name="commissionRate" value={profile.commissionRate} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                <textarea name="about" value={profile.about} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" rows={3} />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600">Save</button>
                <button type="button" className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerProfileViewEdit; 