import React, { useState, useEffect } from 'react';
import ManagerNavbar from '../../components/mediator_navbar';

// Move matchRequests here, outside the component
const matchRequests = [
  { id: 1, from: "Amit Sharma", to: "Sneha Patel", status: "Pending", date: "2025-06-15" },
  { id: 2, from: "Priya Singh", to: "Vikram Rao", status: "Accepted", date: "2025-06-14" },
  { id: 3, from: "Rahul Verma", to: "Anjali Gupta", status: "Pending", date: "2025-06-13" },
];

const ManagerDashboard = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [matchRequestStatuses, setMatchRequestStatuses] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [addUserFormData, setAddUserFormData] = useState({
    managerName: '',
    firstName: '', lastName: '', gender: '', dob: '', maritalStatus: '', height: '', weight: '', bloodGroup: '', photos: [], video: null, aboutMe: '',
    phone: '', email: '', aadhar: '', residingAddress: { address: '', village: '', city: '', state: '', pincode: '' }, nativeAddress: { address: '', village: '', city: '', state: '', pincode: '' }, sameAddress: false,
    education: [{ level: '', stream: '', institute: '' }], employeeRole: '', company: '', annualSalary: '', workLocation: { city: '', state: '', country: '' },
    familyType: '', familyStatus: '', fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '', parentsTogether: true, siblings: [],
    religion: 'Hindu', community: 'Banjara', gothram: '', motherTongue: '', zodiacSign: '',
    dietaryHabits: '', smoking: '', drinking: '', hobbies: '', disabilities: '', medicalConditions: ''
  });
  const [addUserPhotoPreviews, setAddUserPhotoPreviews] = useState([]);
  const [assignedMediators, setAssignedMediators] = useState(matchRequests.map(() => ''));
  const [mediatorList, setMediatorList] = useState([]);
  const [mediatorListLoading, setMediatorListLoading] = useState(true);
  const [mediatorLocationFilter, setMediatorLocationFilter] = useState('');
  const [showMediatorList, setShowMediatorList] = useState(false);

  const assignedProfiles = [
    { 
      id: 1, 
      name: "Amit Sharma", 
      age: 28, 
      location: "Mumbai", 
      status: "Active",
      gender: "Male",
      education: "MBA",
      occupation: "Software Engineer",
      company: "Tech Corp",
      income: "₹8,00,000",
      religion: "Hindu",
      community: "Banjara",
      gothram: "Bharadwaj",
      maritalStatus: "Single",
      aboutMe: "I am a dedicated professional looking for a life partner who shares similar values and goals.",
      photos: ["profile1.jpg", "profile2.jpg"]
    },
    { 
      id: 2, 
      name: "Priya Singh", 
      age: 25, 
      location: "Delhi", 
      status: "Pending",
      gender: "Female",
      education: "MSc",
      occupation: "Data Analyst",
      company: "Analytics Inc",
      income: "₹6,50,000",
      religion: "Hindu",
      community: "Banjara",
      gothram: "Kashyap",
      maritalStatus: "Single",
      aboutMe: "I am passionate about my career and looking for someone who understands and supports my ambitions.",
      photos: ["profile3.jpg", "profile4.jpg"]
    },
    { 
      id: 3, 
      name: "Rahul Verma", 
      age: 30, 
      location: "Bangalore", 
      status: "Active",
      gender: "Male",
      education: "B.Tech",
      occupation: "Product Manager",
      company: "StartupXYZ",
      income: "₹12,00,000",
      religion: "Hindu",
      community: "Banjara",
      gothram: "Gautam",
      maritalStatus: "Single",
      aboutMe: "I am a creative and ambitious person who values family and relationships.",
      photos: ["profile5.jpg", "profile6.jpg"]
    },
    { 
      id: 4, 
      name: "Anjali Gupta", 
      age: 24, 
      location: "Chennai", 
      status: "Active",
      gender: "Female",
      education: "B.Tech",
      occupation: "UX Designer",
      company: "Design Studio",
      income: "₹5,50,000",
      religion: "Hindu",
      community: "Banjara",
      gothram: "Vashistha",
      maritalStatus: "Single",
      aboutMe: "I am a creative person who loves art and design, looking for someone who appreciates creativity.",
      photos: ["profile7.jpg", "profile8.jpg"]
    },
    { 
      id: 5, 
      name: "Vikram Rao", 
      age: 29, 
      location: "Hyderabad", 
      status: "Pending",
      gender: "Male",
      education: "MSc",
      occupation: "Research Scientist",
      company: "Research Lab",
      income: "₹9,00,000",
      religion: "Hindu",
      community: "Banjara",
      gothram: "Bharadwaj",
      maritalStatus: "Single",
      aboutMe: "I am a research-oriented person who values knowledge and intellectual growth.",
      photos: ["profile9.jpg", "profile10.jpg"]
    },
  ];

  const availableProfiles = [
    { id: 101, name: "Sneha Patel", age: 26, location: "Mumbai", education: "MBA" },
    { id: 102, name: "Vikram Rao", age: 29, location: "Delhi", education: "MSc" },
    { id: 103, name: "Anjali Gupta", age: 24, location: "Bangalore", education: "B.Tech" },
    { id: 104, name: "Rajesh Kumar", age: 27, location: "Chennai", education: "MBA" },
    { id: 105, name: "Meera Sharma", age: 25, location: "Hyderabad", education: "MSc" },
  ];

  const [commissions, setCommissions] = useState([
    { id: 1, profile: "Amit Sharma", amount: 199, status: "Paid", date: "2025-06-10" },
    { id: 2, profile: "Priya Singh", amount: 199, status: "Pending", date: "2025-06-12" },
    { id: 3, profile: "Rahul Verma", amount: 199, status: "Failed", date: "2025-06-11" },
    { id: 4, profile: "Anjali Gupta", amount: 199, status: "Pending", date: "2025-06-09" },
    { id: 5, profile: "Vikram Rao", amount: 199, status: "Paid", date: "2025-06-08" },
  ]);

  useEffect(() => {
    setMatchRequestStatuses(matchRequests.map(r => r.status || 'Pending'));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function fetchMediators() {
      setMediatorListLoading(true);
      try {
        const res = await fetch('/api/mediators');
        const data = await res.json();
        setMediatorList(Array.isArray(data) ? data : []);
      } catch (e) {
        setMediatorList([]);
      }
      setMediatorListLoading(false);
    }
    fetchMediators();
  }, []);

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileCard(true);
  };

  const handleCommissionStatusChange = (commissionId, newStatus) => {
    setCommissions(prev => 
      prev.map(commission => 
        commission.id === commissionId 
          ? { ...commission, status: newStatus }
          : commission
      )
    );
  };

  const ProfileCard = ({ profile }) => (
    <div 
      className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleProfileClick(profile)}
    >
      <div>
        <h3 className="font-semibold text-lg">{profile.name}</h3>
        <p className="text-gray-600">Age: {profile.age} | Location: {profile.location}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${
        profile.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
      }`}>
        {profile.status}
      </span>
    </div>
  );

  const ProfileDetailCard = ({ profile, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          {/* Photo Gallery */}
          {profile.photos && profile.photos.length > 0 && (
            <div className="flex gap-3 mb-6 overflow-x-auto">
              {profile.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Profile ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {profile.name}</p>
                <p><span className="font-medium">Age:</span> {profile.age} years</p>
                <p><span className="font-medium">Gender:</span> {profile.gender}</p>
                <p><span className="font-medium">Location:</span> {profile.location}</p>
                <p><span className="font-medium">Status:</span> {profile.status}</p>
                <p><span className="font-medium">Marital Status:</span> {profile.maritalStatus}</p>
                <p><span className="font-medium">Religion:</span> {profile.religion}</p>
                <p><span className="font-medium">Community:</span> {profile.community}</p>
                <p><span className="font-medium">Gothram:</span> {profile.gothram}</p>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Professional Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Education:</span> {profile.education}</p>
                <p><span className="font-medium">Occupation:</span> {profile.occupation}</p>
                <p><span className="font-medium">Company:</span> {profile.company}</p>
                <p><span className="font-medium">Annual Income:</span> {profile.income}</p>
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">About Me</h3>
            <p className="text-gray-600 leading-relaxed">{profile.aboutMe}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredMediatorList = mediatorLocationFilter
    ? mediatorList.filter(m => m.location === mediatorLocationFilter)
    : mediatorList;

  const MatchRequestCard = ({ request, idx, onStatusChange }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-semibold text-lg">{request.from} ↔ {request.to}</h3>
        <p className="text-gray-600">Date: {request.date}</p>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Mediator</label>
          <select
            className="input"
            value={assignedMediators[idx]}
            onChange={e => {
              const newAssignments = [...assignedMediators];
              newAssignments[idx] = e.target.value;
              setAssignedMediators(newAssignments);
            }}
            disabled={mediatorListLoading}
          >
            <option value="">{mediatorListLoading ? 'Loading...' : 'Select Mediator'}</option>
            {filteredMediatorList.map((m, i) => (
              <option key={m.name + m.location + i} value={m.name}>{m.name} ({m.location})</option>
            ))}
          </select>
          {assignedMediators[idx] && (
            <div className="mt-1 text-green-700 text-sm">Assigned: {assignedMediators[idx]}</div>
          )}
        </div>
      </div>
      <div className="flex space-x-2 mt-3 md:mt-0">
        <button
          className={`px-3 py-1 rounded ${matchRequestStatuses[idx] === 'Accepted' ? 'bg-green-400 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`}
          disabled={matchRequestStatuses[idx] === 'Accepted'}
          onClick={() => onStatusChange(idx, 'Accepted')}
        >
          Accept
        </button>
        <button
          className={`px-3 py-1 rounded ${matchRequestStatuses[idx] === 'Rejected' ? 'bg-red-400 text-white' : 'bg-red-500 text-white hover:bg-red-600'}`}
          disabled={matchRequestStatuses[idx] === 'Rejected'}
          onClick={() => onStatusChange(idx, 'Rejected')}
        >
          Reject
        </button>
        <span className={`px-3 py-1 rounded-full text-sm ${
          matchRequestStatuses[idx] === 'Accepted' ? 'bg-green-100 text-green-700' :
          matchRequestStatuses[idx] === 'Rejected' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {matchRequestStatuses[idx] || 'Pending'}
        </span>
      </div>
    </div>
  );

  const CommissionCard = ({ commission }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{commission.profile}</h3>
          <p className="text-gray-600">Amount: ₹{commission.amount} | Date: {commission.date}</p>
        </div>
        <select
          value={commission.status}
          onChange={e => handleCommissionStatusChange(commission.id, e.target.value)}
          className="px-3 py-1 rounded border border-gray-300 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
    </div>
  );

  // Filter profiles by gender
  const maleProfiles = assignedProfiles.filter(profile => profile.gender === "Male");
  const femaleProfiles = assignedProfiles.filter(profile => profile.gender === "Female");

  // Navigation handlers
  const handleProfile = () => {
    window.location.href = '/manager-profile';
  };
  const handleLogout = () => {
    window.location.href = '/';
  };

  function handleAddUserChange(e) {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('residingAddress.') || name.startsWith('nativeAddress.')) {
      const [addrType, field] = name.split('.');
      setAddUserFormData((prev) => ({ ...prev, [addrType]: { ...prev[addrType], [field]: value } }));
    } else if (type === 'checkbox') {
      setAddUserFormData((prev) => ({ ...prev, [name]: checked }));
      if (name === 'sameAddress' && checked) {
        setAddUserFormData((prev) => ({ ...prev, nativeAddress: { ...prev.residingAddress } }));
      }
    } else {
      setAddUserFormData((prev) => ({ ...prev, [name]: value }));
    }
  }
  function handleAddUserPhotoUpload(e) {
    const files = Array.from(e.target.files);
    if (addUserFormData.photos.length + files.length > 5) {
      alert('You can upload a maximum of 5 photos');
      return;
    }
    setAddUserFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
    setAddUserPhotoPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  }
  function removeAddUserPhoto(idx) {
    setAddUserFormData((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));
    setAddUserPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  }
  function handleAddUserEducationChange(idx, field, value) {
    const newEducation = [...addUserFormData.education];
    newEducation[idx][field] = value;
    setAddUserFormData((prev) => ({ ...prev, education: newEducation }));
  }
  function addAddUserEducation() {
    setAddUserFormData((prev) => ({ ...prev, education: [...prev.education, { level: '', stream: '', institute: '' }] }));
  }
  function removeAddUserEducation(idx) {
    setAddUserFormData((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
  }
  function handleAddUserSiblingChange(idx, field, value) {
    const newSiblings = [...addUserFormData.siblings];
    newSiblings[idx] = { ...newSiblings[idx], [field]: value };
    setAddUserFormData((prev) => ({ ...prev, siblings: newSiblings }));
  }
  function addAddUserSibling() {
    setAddUserFormData((prev) => ({ ...prev, siblings: [...prev.siblings, { relation: '', gender: '', occupation: '' }] }));
  }
  function removeAddUserSibling(idx) {
    setAddUserFormData((prev) => ({ ...prev, siblings: prev.siblings.filter((_, i) => i !== idx) }));
  }
  function handleAddUserSubmit(e) {
    e.preventDefault();
    alert('User added! (Implement backend integration here)');
    setShowAddUserForm(false);
  }

  // Extract unique locations from mediatorList
  const mediatorLocations = Array.from(new Set(mediatorList.map(m => m.location))).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-100">
      <ManagerNavbar onProfile={handleProfile} onLogout={handleLogout} onNavigate={setCurrentSection} />
      <div className="max-w-7xl mx-auto p-6">
        {currentSection === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">{assignedProfiles.length}</div>
                <div className="text-lg font-semibold text-gray-700">Assigned Profiles</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">{matchRequests.length}</div>
                <div className="text-lg font-semibold text-gray-700">Match Requests</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">{commissions.length}</div>
                <div className="text-lg font-semibold text-gray-700">Commission Tracker</div>
              </div>
            </div>
            {/* View Mediators Button and List */}
            <div className="mb-8 flex flex-col items-center">
              <button
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 mb-4"
                onClick={() => setShowMediatorList(v => !v)}
              >
                {showMediatorList ? 'Hide Mediators' : 'View Mediators'}
              </button>
              {showMediatorList && (
                <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6 flex flex-col items-center">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mb-4 gap-2">
                    <div className="text-lg font-semibold text-gray-700">Mediators: <span className="text-orange-500 font-bold">{mediatorList.length}</span></div>
                    <div className="flex items-center gap-2">
                      <label className="font-medium">Filter by Location:</label>
                      <select value={mediatorLocationFilter} onChange={e => setMediatorLocationFilter(e.target.value)} className="input">
                        <option value="">All</option>
                        {mediatorLocations.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Mediator List */}
                  <div className="w-full">
                    {filteredMediatorList.length === 0 ? (
                      <div className="text-gray-500 text-center">No mediators found.</div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {filteredMediatorList.map((m, i) => (
                          <li key={m.name + m.location + i} className="py-2 flex justify-between items-center">
                            <span className="font-medium">{m.name}</span>
                            <span className="text-gray-500 text-sm">{m.location}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {currentSection === 'match-requests' && (
          <div className="bg-white rounded-lg shadow p-6 w-full flex flex-col items-center">
            <div className="text-2xl font-bold mb-2">Match Requests</div>
            <div className="text-4xl font-bold text-orange-500 mb-6">{matchRequests.length}</div>
            <div className="w-full max-w-2xl space-y-4">
              {matchRequests.map((req, idx) => (
                <MatchRequestCard key={req.id} request={req} idx={idx} onStatusChange={(i, newStatus) => {
                  setMatchRequestStatuses(statuses => {
                    const updated = [...statuses];
                    updated[i] = newStatus;
                    return updated;
                  });
                }} />
              ))}
            </div>
          </div>
        )}
        {currentSection === 'assigned-profiles' && (
          <div className="bg-white rounded-lg shadow p-6 w-full flex flex-col items-center">
            <div className="text-2xl font-bold mb-4">Assigned Profiles</div>
            <div className="text-4xl font-bold text-orange-500 mb-6">{assignedProfiles.length}</div>
            <div className="w-full flex flex-col md:flex-row gap-8">
              {/* Male Profiles */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">Males</h3>
                <div className="space-y-4">
                  {maleProfiles.length > 0 ? maleProfiles.map(profile => (
                    <div key={profile.id} onClick={() => handleProfileClick(profile)}>
                      <ProfileCard profile={profile} />
                    </div>
                  )) : <div className="text-gray-400 text-center">No male profiles assigned.</div>}
                </div>
              </div>
              {/* Female Profiles */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-pink-600 mb-4 text-center">Females</h3>
                <div className="space-y-4">
                  {femaleProfiles.length > 0 ? femaleProfiles.map(profile => (
                    <div key={profile.id} onClick={() => handleProfileClick(profile)}>
                      <ProfileCard profile={profile} />
                    </div>
                  )) : <div className="text-gray-400 text-center">No female profiles assigned.</div>}
                </div>
              </div>
            </div>
          </div>
        )}
        {currentSection === 'commission-tracker' && (
          <div className="bg-white rounded-lg shadow p-6 w-full flex flex-col items-center">
            <div className="text-2xl font-bold mb-4">Commission Tracker</div>
            <div className="text-4xl font-bold text-orange-500 mb-6">{commissions.length}</div>
            <div className="w-full max-w-2xl space-y-4">
              {commissions.map(c => (
                <CommissionCard key={c.id} commission={c} />
              ))}
            </div>
          </div>
        )}
        {currentSection === 'add-user' && (
          <div className="bg-white rounded-lg shadow p-6 w-full flex flex-col items-center">
            <div className="text-2xl font-bold mb-4">Add User</div>
            <div className="text-gray-700 mb-6 text-center max-w-xl">
              It is better to add an user only when you received amount to represent him/her. Once you create an user, only you will be assigned to help the user to find their match.
            </div>
            {!showAddUserForm && (
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600" onClick={() => setShowAddUserForm(true)}>
                Add User
              </button>
            )}
            {showAddUserForm && (
              <form className="w-full max-w-2xl mt-8 space-y-6" onSubmit={handleAddUserSubmit}>
                {/* Manager Name */}
                <div>
                  <label className="block font-medium mb-1">Mediator Name</label>
                  <input name="mediatorName" value={addUserFormData.mediatorName} onChange={handleAddUserChange} placeholder="Mediator Name" className="input" required />
                </div>
                {/* Basic Personal Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="firstName" value={addUserFormData.firstName} onChange={handleAddUserChange} placeholder="First Name" className="input" required />
                    <input name="lastName" value={addUserFormData.lastName} onChange={handleAddUserChange} placeholder="Last Name" className="input" required />
                    <select name="gender" value={addUserFormData.gender} onChange={handleAddUserChange} className="input" required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <input name="dob" type="date" value={addUserFormData.dob} onChange={handleAddUserChange} className="input" required />
                    <select name="maritalStatus" value={addUserFormData.maritalStatus} onChange={handleAddUserChange} className="input" required>
                      <option value="">Select Marital Status</option>
                      <option value="single">Single</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                    <input name="height" value={addUserFormData.height} onChange={handleAddUserChange} placeholder="Height (e.g., 5'7'')" className="input" required />
                    <input name="weight" value={addUserFormData.weight} onChange={handleAddUserChange} placeholder="Weight (kg)" className="input" required />
                    <input name="bloodGroup" value={addUserFormData.bloodGroup} onChange={handleAddUserChange} placeholder="Blood Group" className="input" required />
                  </div>
                  <div className="mt-4">
                    <label className="block font-medium mb-1">Photograph (min 1, max 5)</label>
                    <input type="file" accept="image/*" multiple onChange={handleAddUserPhotoUpload} />
                    <div className="flex gap-2 mt-2">
                      {addUserPhotoPreviews.map((src, idx) => (
                        <div key={idx} className="relative">
                          <img src={src} alt="preview" className="w-20 h-20 object-cover rounded" />
                          <button type="button" onClick={() => removeAddUserPhoto(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1">&times;</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block font-medium mb-1">Video</label>
                    <input type="file" accept="video/*" onChange={e => setAddUserFormData((prev) => ({ ...prev, video: e.target.files[0] }))} />
                  </div>
                  <div className="mt-4">
                    <label className="block font-medium mb-1">About Me</label>
                    <textarea name="aboutMe" value={addUserFormData.aboutMe} onChange={handleAddUserChange} className="input w-full" rows={4} required />
                  </div>
                </div>
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="phone" value={addUserFormData.phone} onChange={handleAddUserChange} placeholder="Phone Number" className="input" required pattern="[6-9]{1}[0-9]{9}" />
                    <input name="email" value={addUserFormData.email} onChange={handleAddUserChange} placeholder="Email" className="input" required type="email" />
                    <input name="aadhar" value={addUserFormData.aadhar} onChange={handleAddUserChange} placeholder="Aadhar Number" className="input" />
                  </div>
                  <h4 className="font-semibold mt-4">Residing Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="residingAddress.address" value={addUserFormData.residingAddress.address} onChange={handleAddUserChange} placeholder="Address" className="input" />
                    <input name="residingAddress.village" value={addUserFormData.residingAddress.village} onChange={handleAddUserChange} placeholder="Village" className="input" />
                    <input name="residingAddress.city" value={addUserFormData.residingAddress.city} onChange={handleAddUserChange} placeholder="City" className="input" />
                    <input name="residingAddress.state" value={addUserFormData.residingAddress.state} onChange={handleAddUserChange} placeholder="State" className="input" />
                    <input name="residingAddress.pincode" value={addUserFormData.residingAddress.pincode} onChange={handleAddUserChange} placeholder="Pincode" className="input" pattern="[0-9]{6}" maxLength="6" required />
                  </div>
                  <div className="flex items-center mt-2">
                    <input type="checkbox" name="sameAddress" checked={addUserFormData.sameAddress} onChange={handleAddUserChange} className="mr-2" />
                    <label>Native address is same as residing address</label>
                  </div>
                  <h4 className="font-semibold mt-4">Native Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="nativeAddress.address" value={addUserFormData.nativeAddress.address} onChange={handleAddUserChange} placeholder="Address" className="input" />
                    <input name="nativeAddress.village" value={addUserFormData.nativeAddress.village} onChange={handleAddUserChange} placeholder="Village" className="input" />
                    <input name="nativeAddress.city" value={addUserFormData.nativeAddress.city} onChange={handleAddUserChange} placeholder="City" className="input" />
                    <input name="nativeAddress.state" value={addUserFormData.nativeAddress.state} onChange={handleAddUserChange} placeholder="State" className="input" />
                    <input name="nativeAddress.pincode" value={addUserFormData.nativeAddress.pincode} onChange={handleAddUserChange} placeholder="Pincode" className="input" pattern="[0-9]{6}" maxLength="6" required />
                  </div>
                </div>
                {/* Education and Occupation */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Education and Occupation</h3>
                  <div>
                    {addUserFormData.education.map((edu, idx) => (
                      <div key={idx} className="flex flex-wrap gap-2 mb-2 items-end">
                        <select value={edu.level} onChange={e => handleAddUserEducationChange(idx, 'level', e.target.value)} className="input">
                          <option value="">Education Level</option>
                          <option value="10th">10th</option>
                          <option value="inter/diploma">Inter/Diploma</option>
                          <option value="degree">Degree/Graduate</option>
                          <option value="postgraduate">Post Graduate</option>
                        </select>
                        <input value={edu.stream} onChange={e => handleAddUserEducationChange(idx, 'stream', e.target.value)} placeholder="Stream" className="input" />
                        <input value={edu.institute} onChange={e => handleAddUserEducationChange(idx, 'institute', e.target.value)} placeholder="Institute Name" className="input" />
                        <button type="button" onClick={() => removeAddUserEducation(idx)} className="bg-red-500 text-white rounded px-2">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={addAddUserEducation} className="bg-green-500 text-white rounded px-3 py-1 mb-4">Add Education</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="employeeRole" value={addUserFormData.employeeRole} onChange={handleAddUserChange} placeholder="Employee Role" className="input" />
                    <input name="company" value={addUserFormData.company} onChange={handleAddUserChange} placeholder="Company" className="input" />
                    <input name="annualSalary" value={addUserFormData.annualSalary} onChange={handleAddUserChange} placeholder="Annual Salary" className="input" />
                    <input name="workLocation.city" value={addUserFormData.workLocation.city} onChange={handleAddUserChange} placeholder="Work City" className="input" />
                    <input name="workLocation.state" value={addUserFormData.workLocation.state} onChange={handleAddUserChange} placeholder="Work State" className="input" />
                    <input name="workLocation.country" value={addUserFormData.workLocation.country} onChange={handleAddUserChange} placeholder="Work Country" className="input" />
                  </div>
                </div>
                {/* Family Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Family Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="familyType" value={addUserFormData.familyType} onChange={handleAddUserChange} className="input">
                      <option value="">Select Family Type</option>
                      <option value="nuclear">Nuclear</option>
                      <option value="joint">Joint</option>
                      <option value="others">Others</option>
                    </select>
                    <select name="familyStatus" value={addUserFormData.familyStatus} onChange={handleAddUserChange} className="input">
                      <option value="">Select Family Status</option>
                      <option value="lower">Lower</option>
                      <option value="middle">Middle</option>
                      <option value="upper">Upper</option>
                    </select>
                    <input name="fatherName" value={addUserFormData.fatherName} onChange={handleAddUserChange} placeholder="Father's Name" className="input" />
                    <input name="fatherOccupation" value={addUserFormData.fatherOccupation} onChange={handleAddUserChange} placeholder="Father's Occupation" className="input" />
                    <input name="motherName" value={addUserFormData.motherName} onChange={handleAddUserChange} placeholder="Mother's Name" className="input" />
                    <input name="motherOccupation" value={addUserFormData.motherOccupation} onChange={handleAddUserChange} placeholder="Mother's Occupation" className="input" />
                  </div>
                  <div className="flex items-center mt-2">
                    <input type="checkbox" name="parentsTogether" checked={addUserFormData.parentsTogether} onChange={handleAddUserChange} className="mr-2" />
                    <label>Parents are together</label>
                  </div>
                  <h4 className="font-semibold mt-4">Siblings</h4>
                  {addUserFormData.siblings.map((sib, idx) => (
                    <div key={idx} className="flex flex-wrap gap-2 mb-2 items-end">
                      <select value={sib.relation} onChange={e => handleAddUserSiblingChange(idx, 'relation', e.target.value)} className="input">
                        <option value="">Relation</option>
                        <option value="elder">Elder</option>
                        <option value="younger">Younger</option>
                      </select>
                      <select value={sib.gender} onChange={e => handleAddUserSiblingChange(idx, 'gender', e.target.value)} className="input">
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <input value={sib.occupation} onChange={e => handleAddUserSiblingChange(idx, 'occupation', e.target.value)} placeholder="Occupation" className="input" />
                      <button type="button" onClick={() => removeAddUserSibling(idx)} className="bg-red-500 text-white rounded px-2">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={addAddUserSibling} className="bg-green-500 text-white rounded px-3 py-1 mb-4">Add Sibling</button>
                </div>
                {/* Cultural and Religion */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cultural and Religion</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="religion" value={addUserFormData.religion} onChange={handleAddUserChange} className="input">
                      <option value="">Select Religion</option>
                      <option value="hindu">Hindu</option>
                      <option value="muslim">Muslim</option>
                      <option value="christian">Christian</option>
                      <option value="sikh">Sikh</option>
                      <option value="buddhist">Buddhist</option>
                      <option value="jain">Jain</option>
                      <option value="other">Other</option>
                    </select>
                    <input name="community" value={addUserFormData.community} onChange={handleAddUserChange} placeholder="Community" className="input" />
                    <input name="gothram" value={addUserFormData.gothram} onChange={handleAddUserChange} placeholder="Gothram" className="input" />
                    <input name="motherTongue" value={addUserFormData.motherTongue} onChange={handleAddUserChange} placeholder="Mother Tongue" className="input" />
                    <select name="zodiacSign" value={addUserFormData.zodiacSign} onChange={handleAddUserChange} className="input">
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
                {/* Lifestyle, Habits, Health */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Lifestyle, Habits, Health</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="dietaryHabits" value={addUserFormData.dietaryHabits} onChange={handleAddUserChange} className="input">
                      <option value="">Select Dietary Habits</option>
                      <option value="vegan">Vegan</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non-vegetarian">Non Vegetarian</option>
                      <option value="eggetarian">Eggetarian</option>
                    </select>
                    <select name="smoking" value={addUserFormData.smoking} onChange={handleAddUserChange} className="input">
                      <option value="">Select Smoking Preference</option>
                      <option value="never">Never</option>
                      <option value="occasionally">Occasionally</option>
                      <option value="regularly">Regularly</option>
                    </select>
                    <select name="drinking" value={addUserFormData.drinking} onChange={handleAddUserChange} className="input">
                      <option value="">Select Drinking Preference</option>
                      <option value="never">Never</option>
                      <option value="occasionally">Occasionally</option>
                      <option value="regularly">Regularly</option>
                    </select>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies and Interests</label>
                      <input name="hobbies" value={addUserFormData.hobbies} onChange={handleAddUserChange} className="input w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Disabilities</label>
                      <input name="disabilities" value={addUserFormData.disabilities} onChange={handleAddUserChange} className="input w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                      <input name="medicalConditions" value={addUserFormData.medicalConditions} onChange={handleAddUserChange} className="input w-full" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600">Submit</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Profile Detail Modal */}
      {showProfileCard && selectedProfile && (
        <ProfileDetailCard 
          profile={selectedProfile} 
          onClose={() => {
            setShowProfileCard(false);
            setSelectedProfile(null);
          }} 
        />
      )}
    </div>
  );
};

export default ManagerDashboard;