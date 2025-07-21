import React, { useState, useEffect } from 'react';
import Button from '../../components/dashboard/button.js';
import Modal from '../../components/dashboard/modal.js';

const EditProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]); // URLs from backend
  const [newPhotos, setNewPhotos] = useState([]); // {file, preview}
  const [unsavedNewPhotos, setUnsavedNewPhotos] = useState(false); // for draft logic

  // All useEffect hooks at the top, before any early returns
  useEffect(() => {
    setLoading(true);
    // You may need to add authentication headers here
    fetch('http://localhost:5000/users/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        // Set defaults for missing fields
        let firstName = '';
        let lastName = '';
        if (data.fullName) {
          const parts = data.fullName.split(' ');
          firstName = parts[0];
          lastName = parts.slice(1).join(' ');
        }
        const safeData = {
          ...data,
          firstName,
          lastName,
          photos: Array.isArray(data.photos) ? data.photos : [],
          education: Array.isArray(data.education) ? data.education : [],
          siblings: Array.isArray(data.siblings) ? data.siblings : [],
          residingAddress: data.residingAddress || {},
          nativeAddress: data.nativeAddress || {},
          workLocation: data.workLocation || { city: '', state: '', country: '' },
        };
        setProfileData(safeData);
        setEditableData(safeData);
        setExistingPhotos(safeData.photos || []);
        setNewPhotos([]);
        setUnsavedNewPhotos(false);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch profile');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isEditing) {
      const draft = {
        ...editableData,
        photos: existingPhotos
      };
      localStorage.setItem('profileDraft', JSON.stringify(draft));
    }
  }, [editableData, existingPhotos, isEditing]);

  useEffect(() => {
    if (isEditing) {
      const draft = localStorage.getItem('profileDraft');
      if (draft) {
        const parsed = JSON.parse(draft);
        setEditableData(parsed);
        setExistingPhotos(parsed.photos || []);
        setNewPhotos([]); // Can't restore files
        setUnsavedNewPhotos(false);
        if (parsed.photos && parsed.photos.length > 0) {
          setModalTitle('Draft Loaded');
          setModalMessage('A saved draft was loaded. If you had unsaved new photos, please re-upload them.');
          setShowConfirmButton(false);
          setIsModalOpen(true);
        }
      }
    }
  }, [isEditing]);

  // Clean up blob URLs for new photo previews
  useEffect(() => {
    return () => {
      newPhotos.forEach(obj => {
        if (obj.preview) URL.revokeObjectURL(obj.preview);
      });
    };
  }, [newPhotos]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('residingAddress.') || name.startsWith('nativeAddress.')) {
      const [addrType, field] = name.split('.');
      setEditableData((prev) => ({
        ...prev,
        [addrType]: { ...prev[addrType], [field]: value },
      }));
    } else if (type === 'checkbox') {
      setEditableData((prev) => ({ ...prev, [name]: checked }));
      if (name === 'sameAddress' && checked) {
        setEditableData((prev) => ({
          ...prev,
          nativeAddress: { ...prev.residingAddress },
        }));
      }
    } else {
      setEditableData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEducationChange = (idx, field, value) => {
    const newEducation = [...editableData.education];
    newEducation[idx][field] = value;
    setEditableData((prev) => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setEditableData((prev) => ({ 
      ...prev, 
      education: [...prev.education, { level: '', stream: '', institute: '' }] 
    }));
  };

  const removeEducation = (idx) => {
    setEditableData((prev) => ({ 
      ...prev, 
      education: prev.education.filter((_, i) => i !== idx) 
    }));
  };

  const handleSiblingChange = (idx, field, value) => {
    const newSiblings = [...editableData.siblings];
    newSiblings[idx] = { ...newSiblings[idx], [field]: value };
    setEditableData((prev) => ({ ...prev, siblings: newSiblings }));
  };

  const addSibling = () => {
    setEditableData((prev) => ({ 
      ...prev, 
      siblings: [...prev.siblings, { relation: '', gender: '', occupation: '' }] 
    }));
  };

  const removeSibling = (idx) => {
    setEditableData((prev) => ({ 
      ...prev, 
      siblings: prev.siblings.filter((_, i) => i !== idx) 
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (existingPhotos.length + newPhotos.length + files.length > 5) {
      alert('You can upload a maximum of 5 photos');
      return;
    }
    const newPhotoObjs = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setNewPhotos(prev => [...prev, ...newPhotoObjs]);
    setUnsavedNewPhotos(true);
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Update draft in localStorage if editing
      if (isEditing) {
        const draft = {
          ...editableData,
          photos: updated
        };
        localStorage.setItem('profileDraft', JSON.stringify(draft));
      }
      return updated;
    });
  };

  const removeNewPhoto = (index) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditableData({ ...profileData });
    setExistingPhotos(profileData.photos || []);
    setNewPhotos([]);
    setUnsavedNewPhotos(false);
  };

  const handleSave = () => {
    setLoading(true);
    const formData = new FormData();
    // Add all fields except photos
    Object.entries(editableData).forEach(([key, value]) => {
      if (key !== 'photos') {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });
    // Add existing photo URLs
    existingPhotos.forEach(url => formData.append('existingPhotos[]', url));
    // Add new photo files
    newPhotos.forEach(obj => formData.append('photos', obj.file));

    // Debug logs
    console.log('Saving profile:');
    console.log('existingPhotos:', existingPhotos);
    console.log('newPhotos:', newPhotos.map(obj => obj.file.name));

    fetch('http://localhost:5000/users/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setProfileData(data);
        setIsEditing(false);
        setModalTitle('Profile Updated');
        setModalMessage('Your profile has been successfully updated!');
        setShowConfirmButton(false);
        setIsModalOpen(true);
        setExistingPhotos(data.photos || []);
        setNewPhotos([]);
        setUnsavedNewPhotos(false);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to update profile');
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableData({ ...profileData });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderField = (label, value, type = 'text', options = null) => {
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select 
            value={value} 
            onChange={handleChange}
            name={label.toLowerCase().replace(/\s+/g, '')}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      }
      return (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          name={label.toLowerCase().replace(/\s+/g, '')}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      );
    }
    return (
      <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md">
        {value || 'Not specified'}
      </div>
    );
  };

  const renderSection = (title, fields) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Add safe defaults for nested objects
  const workLocation = (profileData && profileData.workLocation) ? profileData.workLocation : { city: '', state: '', country: '' };
  const residingAddress = (profileData && profileData.residingAddress) ? profileData.residingAddress : {};
  const nativeAddress = (profileData && profileData.nativeAddress) ? profileData.nativeAddress : {};

  const getPhotoUrl = (photo) => {
    if (!photo) return '/default-profile.png';
    return photo.startsWith('/uploads') ? `http://localhost:5000${photo}` : photo;
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-3xl font-bold text-gray-800">Profile Information</h2>
        {!isEditing && (
          <Button onClick={handleEdit} variant="primary">
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Photo Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Profile Photos</h3>
        <div className="flex flex-wrap gap-4">
          {existingPhotos.map((photo, index) => (
            <div key={photo + index} className="relative">
              <img src={photo.startsWith('/uploads') ? `http://localhost:5000${photo}` : photo} alt="Profile" className="w-32 h-32 object-cover rounded-lg border-2 border-orange-300" />
              {isEditing && (
                <button onClick={() => removeExistingPhoto(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center">&times;</button>
              )}
            </div>
          ))}
          {newPhotos.map((obj, index) => (
            <div key={obj.preview + index} className="relative">
              <img src={obj.preview} alt="New Profile" className="w-32 h-32 object-cover rounded-lg border-2 border-green-400" />
              {isEditing && (
                <button onClick={() => removeNewPhoto(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center">&times;</button>
              )}
            </div>
          ))}
          {isEditing && (existingPhotos.length + newPhotos.length < 5) && (
            <label className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400">
              <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotoUpload} />
              <span className="text-gray-400">+ Add Photo</span>
            </label>
          )}
        </div>
        {unsavedNewPhotos && (
          <div className="text-orange-600 mt-2">You have new photos that are not yet saved. Please save your profile to upload them.</div>
        )}
      </div>

      {/* Basic Personal Details */}
      {renderSection('Basic Personal Details', [
        <div key="name">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              <input
                name="firstName"
                value={editableData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                name="lastName"
                value={editableData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ) : (
            <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md">
              {`${profileData.firstName} ${profileData.lastName}`}
            </div>
          )}
        </div>,
        <div key="gender">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          {renderField('Gender', profileData.gender, 'select', [
            { value: '', label: 'Select Gender' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ])}
        </div>,
        <div key="dob">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          {renderField('Date of Birth', profileData.dob, 'date')}
        </div>,
        <div key="marital">
          <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
          {renderField('Marital Status', profileData.maritalStatus, 'select', [
            { value: '', label: 'Select Marital Status' },
            { value: 'single', label: 'Single' },
            { value: 'divorced', label: 'Divorced' },
            { value: 'widowed', label: 'Widowed' }
          ])}
        </div>,
        <div key="height">
          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          {renderField('Height', profileData.height)}
        </div>,
        <div key="weight">
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          {renderField('Weight', profileData.weight, 'number')}
        </div>,
        <div key="blood">
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
          {renderField('Blood Group', profileData.bloodGroup)}
        </div>
      ])}

      {/* About Me */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">About Me</h3>
        {isEditing ? (
          <textarea
            name="aboutMe"
            value={editableData.aboutMe}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        ) : (
          <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md">
            {profileData.aboutMe || 'No description provided'}
          </div>
        )}
      </div>

      {/* Contact Information */}
      {renderSection('Contact Information', [
        <div key="phone">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          {renderField('Phone', profileData.phone, 'tel')}
        </div>,
        <div key="email">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          {renderField('Email', profileData.email, 'email')}
        </div>,
        <div key="aadhar">
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
          {renderField('Aadhar', profileData.aadhar)}
        </div>
      ])}

      {/* Residing Address */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Residing Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(residingAddress).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {isEditing ? (
                <input
                  name={`residingAddress.${key}`}
                  value={editableData.residingAddress[key]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md">
                  {value || 'Not specified'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Native Address */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Native Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(nativeAddress).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {isEditing ? (
                <input
                  name={`nativeAddress.${key}`}
                  value={editableData.nativeAddress[key]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md">
                  {value || 'Not specified'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education and Occupation */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Education and Occupation</h3>
        
        {/* Education */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Education</h4>
          {Array.isArray(profileData.education) ? profileData.education.map((edu, idx) => (
            <div key={idx} className="mb-4 p-4 border border-gray-200 rounded-lg">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={editableData.education[idx].level}
                    onChange={(e) => handleEducationChange(idx, 'level', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Education Level</option>
                    <option value="10th">10th</option>
                    <option value="inter/diploma">Inter/Diploma</option>
                    <option value="degree">Degree/Graduate</option>
                    <option value="postgraduate">Post Graduate</option>
                  </select>
                  <input
                    value={editableData.education[idx].stream}
                    onChange={(e) => handleEducationChange(idx, 'stream', e.target.value)}
                    placeholder="Stream"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="flex gap-2">
                    <input
                      value={editableData.education[idx].institute}
                      onChange={(e) => handleEducationChange(idx, 'institute', e.target.value)}
                      placeholder="Institute Name"
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={() => removeEducation(idx)}
                      className="px-3 py-3 bg-red-500 text-white rounded-md"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    {edu.level || 'Not specified'}
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    {edu.stream || 'Not specified'}
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    {edu.institute || 'Not specified'}
                  </div>
                </div>
              )}
            </div>
          )) : null}
          {isEditing && (
            <button
              onClick={addEducation}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Add Education
            </button>
          )}
        </div>

        {/* Occupation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Role</label>
            {renderField('Employee Role', profileData.employeeRole)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            {renderField('Company', profileData.company)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary</label>
            {renderField('Annual Salary', profileData.annualSalary)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
            {isEditing ? (
              <div className="grid grid-cols-3 gap-2">
                <input
                  name="workLocation.city"
                  value={editableData.workLocation.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  name="workLocation.state"
                  value={editableData.workLocation.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  name="workLocation.country"
                  value={editableData.workLocation.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ) : (
              <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md">
                {`${workLocation.city}, ${workLocation.state}, ${workLocation.country}`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Family Details */}
      {renderSection('Family Details', [
        <div key="familyType">
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Type</label>
          {renderField('Family Type', profileData.familyType, 'select', [
            { value: '', label: 'Select Family Type' },
            { value: 'nuclear', label: 'Nuclear' },
            { value: 'joint', label: 'Joint' },
            { value: 'others', label: 'Others' }
          ])}
        </div>,
        <div key="familyStatus">
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Status</label>
          {renderField('Family Status', profileData.familyStatus, 'select', [
            { value: '', label: 'Select Family Status' },
            { value: 'lower', label: 'Lower' },
            { value: 'middle', label: 'Middle' },
            { value: 'upper', label: 'Upper' }
          ])}
        </div>,
        <div key="fatherName">
          <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
          {renderField('Father Name', profileData.fatherName)}
        </div>,
        <div key="fatherOccupation">
          <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
          {renderField('Father Occupation', profileData.fatherOccupation)}
        </div>,
        <div key="motherName">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
          {renderField('Mother Name', profileData.motherName)}
        </div>,
        <div key="motherOccupation">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
          {renderField('Mother Occupation', profileData.motherOccupation)}
        </div>
      ])}

      {/* Cultural and Religion */}
      {renderSection('Cultural and Religion', [
        <div key="religion">
          <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
          {renderField('Religion', profileData.religion, 'select', [
            { value: '', label: 'Select Religion' },
            { value: 'hindu', label: 'Hindu' },
            { value: 'muslim', label: 'Muslim' },
            { value: 'christian', label: 'Christian' },
            { value: 'sikh', label: 'Sikh' },
            { value: 'buddhist', label: 'Buddhist' },
            { value: 'jain', label: 'Jain' },
            { value: 'other', label: 'Other' }
          ])}
        </div>,
        <div key="community">
          <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
          {renderField('Community', profileData.community)}
        </div>,
        <div key="gothram">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gothram</label>
          {renderField('Gothram', profileData.gothram)}
        </div>,
        <div key="motherTongue">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
          {renderField('Mother Tongue', profileData.motherTongue)}
        </div>,
        <div key="zodiacSign">
          <label className="block text-sm font-medium text-gray-700 mb-1">Zodiac Sign</label>
          {renderField('Zodiac Sign', profileData.zodiacSign, 'select', [
            { value: '', label: 'Select Zodiac Sign' },
            { value: 'aries', label: 'Aries' },
            { value: 'taurus', label: 'Taurus' },
            { value: 'gemini', label: 'Gemini' },
            { value: 'cancer', label: 'Cancer' },
            { value: 'leo', label: 'Leo' },
            { value: 'virgo', label: 'Virgo' },
            { value: 'libra', label: 'Libra' },
            { value: 'scorpio', label: 'Scorpio' },
            { value: 'sagittarius', label: 'Sagittarius' },
            { value: 'capricorn', label: 'Capricorn' },
            { value: 'aquarius', label: 'Aquarius' },
            { value: 'pisces', label: 'Pisces' }
          ])}
        </div>
      ])}

      {/* Lifestyle, Habits, Health */}
      {renderSection('Lifestyle, Habits, and Health', [
        <div key="dietaryHabits">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Habits</label>
          {renderField('Dietary Habits', profileData.dietaryHabits, 'select', [
            { value: '', label: 'Select Dietary Habits' },
            { value: 'vegan', label: 'Vegan' },
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'non-vegetarian', label: 'Non Vegetarian' },
            { value: 'eggetarian', label: 'Eggetarian' }
          ])}
        </div>,
        <div key="smoking">
          <label className="block text-sm font-medium text-gray-700 mb-1">Smoking</label>
          {renderField('Smoking', profileData.smoking, 'select', [
            { value: '', label: 'Select Smoking Preference' },
            { value: 'never', label: 'Never' },
            { value: 'occasionally', label: 'Occasionally' },
            { value: 'regularly', label: 'Regularly' }
          ])}
        </div>,
        <div key="drinking">
          <label className="block text-sm font-medium text-gray-700 mb-1">Drinking</label>
          {renderField('Drinking', profileData.drinking, 'select', [
            { value: '', label: 'Select Drinking Preference' },
            { value: 'never', label: 'Never' },
            { value: 'occasionally', label: 'Occasionally' },
            { value: 'regularly', label: 'Regularly' }
          ])}
        </div>,
        <div key="hobbies">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies and Interests</label>
          {isEditing ? (
            <textarea
              name="hobbies"
              value={editableData.hobbies}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          ) : (
            <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md">
              {profileData.hobbies || 'Not specified'}
            </div>
          )}
        </div>,
        <div key="disabilities">
          <label className="block text-sm font-medium text-gray-700 mb-1">Physical Disabilities</label>
          {isEditing ? (
            <textarea
              name="disabilities"
              value={editableData.disabilities}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          ) : (
            <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md">
              {profileData.disabilities || 'None'}
            </div>
          )}
        </div>,
        <div key="medicalConditions">
          <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
          {isEditing ? (
            <textarea
              name="medicalConditions"
              value={editableData.medicalConditions}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          ) : (
            <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md">
              {profileData.medicalConditions || 'None'}
            </div>
          )}
        </div>
      ])}

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
          <Button onClick={handleCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="primary">
            Save Changes
          </Button>
        </div>
      )}

      <Modal
        title={modalTitle}
        message={modalMessage}
        isOpen={isModalOpen}
        onClose={closeModal}
        showConfirmButton={showConfirmButton}
      />
    </div>
  );
};

export default EditProfilePage;
