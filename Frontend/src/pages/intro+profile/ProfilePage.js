import React, { useState } from 'react';
import axios from 'axios';

const steps = [
  'Basic Personal Details',
  'Contact Information',
  'Education and Occupation',
  'Family Details',
  'Cultural and Religion',
  'Life style, Habits and Health Info',
];

const initialFormData = {
  // a) Basic Personal Details
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  maritalStatus: '',
  height: '',
  weight: '',
  bloodGroup: '',
  photos: [],
  video: null,
  aboutMe: '',
  // b) Contact Information
  phone: '',
  email: '',
  aadhar: '',
  residingAddress: { address: '', village: '', city: '', state: '', pincode: '' },
  nativeAddress: { address: '', village: '', city: '', state: '', pincode: '' },
  sameAddress: false,
  // c) Education and Occupation
  education: [{ level: '', stream: '', institute: '' }],
  employeeRole: '',
  company: '',
  annualSalary: '',
  workLocation: { city: '', state: '', country: '' },
  // d) Family Details
  familyType: '',
  familyStatus: '',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  parentsTogether: true,
  siblings: [],
  // e) Cultural and Religion
  religion: 'Hindu',
  community: 'Banjara',
  gothram: '',
  motherTongue: '',
  zodiacSign: '',
  // f) Lifestyle, Habits, Health
  dietaryHabits: '',
  smoking: '',
  drinking: '',
  hobbies: '',
  disabilities: '',
  medicalConditions: '',
};

const ProfilePage = ({ onProfileComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('residingAddress.') || name.startsWith('nativeAddress.')) {
      const [addrType, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [addrType]: { ...prev[addrType], [field]: value },
      }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      if (name === 'sameAddress' && checked) {
        setFormData((prev) => ({
          ...prev,
          nativeAddress: { ...prev.residingAddress },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 5) {
      alert('You can upload a maximum of 5 photos');
      return;
    }
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
    setPhotoPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  // Remove photo
  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Education fields
  const handleEducationChange = (idx, field, value) => {
    const newEducation = [...formData.education];
    newEducation[idx][field] = value;
    setFormData((prev) => ({ ...prev, education: newEducation }));
  };
  const addEducation = () => {
    setFormData((prev) => ({ ...prev, education: [...prev.education, { level: '', stream: '', institute: '' }] }));
  };
  const removeEducation = (idx) => {
    setFormData((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
  };

  // Siblings fields
  const handleSiblingChange = (idx, field, value) => {
    const newSiblings = [...formData.siblings];
    newSiblings[idx] = { ...newSiblings[idx], [field]: value };
    setFormData((prev) => ({ ...prev, siblings: newSiblings }));
  };
  const addSibling = () => {
    setFormData((prev) => ({ ...prev, siblings: [...prev.siblings, { relation: '', gender: '', occupation: '' }] }));
  };
  const removeSibling = (idx) => {
    setFormData((prev) => ({ ...prev, siblings: prev.siblings.filter((_, i) => i !== idx) }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only submit if we're on the last step
    if (step === steps.length - 1) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication error. Please log in again.');
                return;
            }

            // The backend expects `fullName`, not firstName and lastName.
            const profileDataToSend = {
                ...formData,
                fullName: `${formData.firstName} ${formData.lastName}`,
            };
            
            // Remove the now-redundant fields
            delete profileDataToSend.firstName;
            delete profileDataToSend.lastName;


            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.put('http://localhost:5000/users/me', profileDataToSend, config);

            alert('Profile saved successfully!');
            if (onProfileComplete) {
                onProfileComplete();
            }

        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            alert('Error saving profile. Please check the console for details and try again.');
        }
    }
  };

  // Navigation
  const nextStep = (e) => {
    e.preventDefault(); // Prevent any form submission
    console.log('Current step before next:', step);
    console.log('Total steps:', steps.length);
    if (step < 5) {  // Explicitly check for step 5
      setStep(step + 1);
      console.log('Moving to step:', step + 1);
    }
  };

  const prevStep = (e) => {
    e.preventDefault(); // Prevent any form submission
    console.log('Current step before prev:', step);
    if (step > 0) {
      setStep(step - 1);
      console.log('Moving to step:', step - 1);
    }
  };

  // Render step content
  const renderStep = () => {
    console.log('Rendering step:', step, 'of', steps.length - 1);
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Basic Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="input" required />
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="input" required />
              <select name="gender" value={formData.gender} onChange={handleChange} className="input" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="input" required min="" />
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input" required>
                <option value="">Select Marital Status</option>
                <option value="single">Single</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
              <input name="height" value={formData.height} onChange={handleChange} placeholder="Height (e.g., 5'7'')" className="input" required />
              <input name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" className="input" required />
              <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="Blood Group" className="input" required />
            </div>
            <div className="mt-4">
              <label className="block font-medium mb-1">Photograph (min 1, max 5)</label>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
              <div className="flex gap-2 mt-2">
                {photoPreviews.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img src={src} alt="preview" className="w-20 h-20 object-cover rounded" />
                    <button type="button" onClick={() => removePhoto(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1">&times;</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium mb-1">Video</label>
              <input type="file" accept="video/*" onChange={(e) => setFormData((prev) => ({ ...prev, video: e.target.files[0] }))} />
            </div>
            <div className="mt-4">
              <label className="block font-medium mb-1">About Me</label>
              <textarea 
                name="aboutMe" 
                value={formData.aboutMe} 
                onChange={handleChange} 
                className="input w-full" 
                rows={4} 
                required 
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="input" required pattern="[6-9]{1}[0-9]{9}" />
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input" required type="email" />
              <input name="aadhar" value={formData.aadhar} onChange={handleChange} placeholder="Aadhar Number" className="input" />
            </div>
            <h3 className="font-semibold mt-6">Residing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="residingAddress.address" value={formData.residingAddress.address} onChange={handleChange} placeholder="Address" className="input" />
              <input name="residingAddress.village" value={formData.residingAddress.village} onChange={handleChange} placeholder="Village" className="input" />
              <input name="residingAddress.city" value={formData.residingAddress.city} onChange={handleChange} placeholder="City" className="input" />
              <input name="residingAddress.state" value={formData.residingAddress.state} onChange={handleChange} placeholder="State" className="input" />
              <input name="residingAddress.pincode" value={formData.residingAddress.pincode} onChange={handleChange} placeholder="Pincode" className="input" pattern="[0-9]{6}" maxLength="6" required />
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" name="sameAddress" checked={formData.sameAddress} onChange={handleChange} className="mr-2" />
              <label>Native address is same as residing address</label>
            </div>
            <h3 className="font-semibold mt-6">Native Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="nativeAddress.address" value={formData.nativeAddress.address} onChange={handleChange} placeholder="Address" className="input" />
              <input name="nativeAddress.village" value={formData.nativeAddress.village} onChange={handleChange} placeholder="Village" className="input" />
              <input name="nativeAddress.city" value={formData.nativeAddress.city} onChange={handleChange} placeholder="City" className="input" />
              <input name="nativeAddress.state" value={formData.nativeAddress.state} onChange={handleChange} placeholder="State" className="input" />
              <input name="nativeAddress.pincode" value={formData.nativeAddress.pincode} onChange={handleChange} placeholder="Pincode" className="input" pattern="[0-9]{6}" maxLength="6" required />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Education and Occupation</h2>
            <div>
              {formData.education.map((edu, idx) => (
                <div key={idx} className="flex flex-wrap gap-2 mb-2 items-end">
                  <select value={edu.level} onChange={e => handleEducationChange(idx, 'level', e.target.value)} className="input">
                    <option value="">Education Level</option>
                    <option value="10th">10th</option>
                    <option value="inter/diploma">Inter/Diploma</option>
                    <option value="degree">Degree/Graduate</option>
                    <option value="postgraduate">Post Graduate</option>
                  </select>
                  <input value={edu.stream} onChange={e => handleEducationChange(idx, 'stream', e.target.value)} placeholder="Stream" className="input" />
                  <input value={edu.institute} onChange={e => handleEducationChange(idx, 'institute', e.target.value)} placeholder="Institute Name" className="input" />
                  <button type="button" onClick={() => removeEducation(idx)} className="bg-red-500 text-white rounded px-2">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addEducation} className="bg-green-500 text-white rounded px-3 py-1 mb-4">Add Education</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="employeeRole" value={formData.employeeRole} onChange={handleChange} placeholder="Employee Role" className="input" />
              <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="input" />
              <input name="annualSalary" value={formData.annualSalary} onChange={handleChange} placeholder="Annual Salary" className="input" />
              <input name="workLocation.city" value={formData.workLocation.city} onChange={handleChange} placeholder="Work City" className="input" />
              <input name="workLocation.state" value={formData.workLocation.state} onChange={handleChange} placeholder="Work State" className="input" />
              <input name="workLocation.country" value={formData.workLocation.country} onChange={handleChange} placeholder="Work Country" className="input" />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Family Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="familyType" value={formData.familyType} onChange={handleChange} className="input">
                <option value="">Select Family Type</option>
                <option value="nuclear">Nuclear</option>
                <option value="joint">Joint</option>
                <option value="others">Others</option>
              </select>
              <select name="familyStatus" value={formData.familyStatus} onChange={handleChange} className="input">
                <option value="">Select Family Status</option>
                <option value="lower">Lower</option>
                <option value="middle">Middle</option>
                <option value="upper">Upper</option>
              </select>
              <input name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" className="input" />
              <input name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} placeholder="Father's Occupation" className="input" />
              <input name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Mother's Name" className="input" />
              <input name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} placeholder="Mother's Occupation" className="input" />
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" name="parentsTogether" checked={formData.parentsTogether} onChange={handleChange} className="mr-2" />
              <label>Parents are together</label>
            </div>
            <h3 className="font-semibold mt-6">Siblings</h3>
            {formData.siblings.map((sib, idx) => (
              <div key={idx} className="flex flex-wrap gap-2 mb-2 items-end">
                <select value={sib.relation} onChange={e => handleSiblingChange(idx, 'relation', e.target.value)} className="input">
                  <option value="">Relation</option>
                  <option value="elder">Elder</option>
                  <option value="younger">Younger</option>
                </select>
                <select value={sib.gender} onChange={e => handleSiblingChange(idx, 'gender', e.target.value)} className="input">
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input value={sib.occupation} onChange={e => handleSiblingChange(idx, 'occupation', e.target.value)} placeholder="Occupation" className="input" />
                <button type="button" onClick={() => removeSibling(idx)} className="bg-red-500 text-white rounded px-2">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addSibling} className="bg-green-500 text-white rounded px-3 py-1 mb-4">Add Sibling</button>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Cultural and Religion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="religion" value={formData.religion} onChange={handleChange} className="input">
                <option value="">Select Religion</option>
                <option value="hindu">Hindu</option>
                <option value="muslim">Muslim</option>
                <option value="christian">Christian</option>
                <option value="sikh">Sikh</option>
                <option value="buddhist">Buddhist</option>
                <option value="jain">Jain</option>
                <option value="other">Other</option>
              </select>
              <input name="community" value={formData.community} onChange={handleChange} placeholder="Community" className="input" />
              <input name="gothram" value={formData.gothram} onChange={handleChange} placeholder="Gothram" className="input" />
              <input name="motherTongue" value={formData.motherTongue} onChange={handleChange} placeholder="Mother Tongue" className="input" />
              <select name="zodiacSign" value={formData.zodiacSign} onChange={handleChange} className="input">
                <option value="">Select Zodiac Sign</option>
                <option value="aries">Aries</option>
                <option value="taurus">Taurus</option>
                <option value="gemini">Gemini</option>
                <option value="cancer">Cancer</option>
                <option value="leo">Leo</option>
                <option value="virgo">Virgo</option>
                <option value="libra">Libra</option>
                <option value="scorpio">Scorpio</option>
                <option value="sagittarius">Sagittarius</option>
                <option value="capricorn">Capricorn</option>
                <option value="aquarius">Aquarius</option>
                <option value="pisces">Pisces</option>
              </select>
            </div>
          </div>
        );
      case 5:
        console.log('Rendering Life style page');
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Life style, Habits and Health Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="dietaryHabits" value={formData.dietaryHabits} onChange={handleChange} className="input">
                <option value="">Select Dietary Habits</option>
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
              </select>
              <select name="smoking" value={formData.smoking} onChange={handleChange} className="input">
                <option value="">Select Smoking Preference</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="regularly">Regularly</option>
              </select>
              <select name="drinking" value={formData.drinking} onChange={handleChange} className="input">
                <option value="">Select Drinking Preference</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="regularly">Regularly</option>
              </select>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies and Interests</label>
                <input 
                  name="hobbies" 
                  value={formData.hobbies} 
                  onChange={handleChange} 
                  placeholder="Enter your hobbies and interests" 
                  className="input w-full" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Physical Disabilities</label>
                <input 
                  name="disabilities" 
                  value={formData.disabilities} 
                  onChange={handleChange} 
                  placeholder="Enter any physical disabilities" 
                  className="input w-full" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre-existing Medical Conditions</label>
                <input 
                  name="medicalConditions" 
                  value={formData.medicalConditions} 
                  onChange={handleChange} 
                  placeholder="Enter any pre-existing medical conditions" 
                  className="input w-full" 
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-start py-6">
      {/* Thoranam row */}
      <div className="w-full flex flex-row bg-amber-50" style={{ height: '80px' }}>
        <img src="/thoraanam_nobg.png" alt="Thoranam" className="h-full w-1/3 object-cover" />
        <img src="/thoraanam_nobg.png" alt="Thoranam" className="h-full w-1/3 object-cover" />
        <img src="/thoraanam_nobg.png" alt="Thoranam" className="h-full w-1/3 object-cover" />
      </div>
      {/* Logo and Title */}
      <div className="flex justify-center items-center py-4 bg-amber-50">
        <div className="flex items-center gap-4">
          <h1 className="text-[#1a0f10] text-2xl font-bold leading-tight tracking-[-0.015em]">Viya</h1>
          <img src="/logo_nobg.png" alt="Viya Matrimony Logo" className="h-16 w-auto" />
          <h1 className="text-[#1a0f10] text-2xl font-bold leading-tight tracking-[-0.015em]">Matrimony</h1>
        </div>
      </div>
      {/* Step Progress Bar */}
      <div className="flex flex-col items-center w-full mb-8">
        <div className="flex items-center w-full max-w-3xl justify-between">
          {steps.map((label, idx) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setStep(idx)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 focus:outline-none
                    ${step > idx ? 'bg-blue-500 border-blue-500 text-white' : step === idx ? 'bg-white border-blue-500 text-blue-500' : 'bg-gray-200 border-gray-300 text-gray-400'}
                    ${step !== idx ? 'hover:bg-blue-100 cursor-pointer' : ''}
                  `}
                  style={{ cursor: step !== idx ? 'pointer' : 'default' }}
                  aria-label={`Go to step ${idx + 1}`}
                >
                  {step > idx ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <span className="font-bold text-lg">{idx + 1}</span>
                  )}
                </button>
                <span className={`mt-2 text-xs font-semibold ${step === idx ? 'text-blue-600' : 'text-gray-500'}`}>{label.split(' ')[0]}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-1 md:mx-2 rounded transition-all duration-300
                  ${step > idx ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Profile Form and Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl mt-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Your Profile</h1>
          <div className="text-orange-500 font-semibold">Step {step + 1} of {steps.length}: {steps[step]}</div>
        </div>
        <form onSubmit={handleSubmit}>
          {renderStep()}
          <div className="flex justify-between mt-8">
            <button 
              type="button" 
              onClick={prevStep} 
              disabled={step === 0} 
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            {step === 5 ? (
              <button 
                type="submit" 
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                Submit
              </button>
            ) : (
              <button 
                type="button" 
                onClick={nextStep} 
                className="px-4 py-2 rounded bg-orange-500 text-white"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;