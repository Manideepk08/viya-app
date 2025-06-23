import React, { useState, useEffect } from 'react';
import MediatorNavbar from '../../components/mediator_navbar';

const MediatorDashboard = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [selectedMatchProfile, setSelectedMatchProfile] = useState('');
  const [showCommissionTracker, setShowCommissionTracker] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [dummyState, setDummyState] = useState(false);
  const [matchRequestStatuses, setMatchRequestStatuses] = useState([]);

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

  const matchRequests = [
    { id: 1, from: "Amit Sharma", to: "Sneha Patel", status: "Pending", date: "2025-06-15" },
    { id: 2, from: "Priya Singh", to: "Vikram Rao", status: "Accepted", date: "2025-06-14" },
    { id: 3, from: "Rahul Verma", to: "Anjali Gupta", status: "Pending", date: "2025-06-13" },
  ];

  const [commissions, setCommissions] = useState([
    { id: 1, profile: "Amit Sharma", amount: 5000, status: "Paid", date: "2025-06-10" },
    { id: 2, profile: "Priya Singh", amount: 3000, status: "Pending", date: "2025-06-12" },
    { id: 3, profile: "Rahul Verma", amount: 4000, status: "Failed", date: "2025-06-11" },
    { id: 4, profile: "Anjali Gupta", amount: 3500, status: "Pending", date: "2025-06-09" },
    { id: 5, profile: "Vikram Rao", amount: 6000, status: "Paid", date: "2025-06-08" },
  ]);

  useEffect(() => {
    setMatchRequestStatuses(matchRequests.map(r => r.status || 'Pending'));
    // eslint-disable-next-line
  }, []);

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileCard(true);
  };

  const handleAddMatch = () => {
    if (selectedMatchProfile && selectedProfile) {
      const matchProfile = availableProfiles.find(p => p.id === parseInt(selectedMatchProfile));
      if (matchProfile) {
        // Here you would typically send this to your backend
        alert(`Match request sent: ${selectedProfile.name} ↔ ${matchProfile.name}`);
        setSelectedMatchProfile('');
      }
    }
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

  const MatchRequestCard = ({ request, idx, onStatusChange }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-semibold text-lg">{request.from} ↔ {request.to}</h3>
        <p className="text-gray-600">Date: {request.date}</p>
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
          onChange={(e) => handleCommissionStatusChange(commission.id, e.target.value)}
          className={`px-3 py-1 rounded-full text-sm border-0 ${
            commission.status === "Paid" ? "bg-green-100 text-green-700" :
            commission.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          }`}
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
    window.location.href = '/mediator-profile';
  };
  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MediatorNavbar onProfile={handleProfile} onLogout={handleLogout} onNavigate={setCurrentSection} />
      <div className="max-w-7xl mx-auto p-6">
        {currentSection === 'dashboard' && (
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
        )}
        {currentSection === 'match-requests' && (
          <div className="bg-white rounded-lg shadow p-6 w-full flex flex-col items-center">
            <div className="text-2xl font-bold mb-4">Match Requests</div>
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
            <ul className="w-full max-w-2xl divide-y">
              {commissions.map(c => (
                <li key={c.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                  <span><b>Profile:</b> {c.profile}</span>
                  <span className="text-sm text-gray-500">Amount: ₹{c.amount} | Status: {c.status} | Date: {c.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {currentSection === 'add-user' && (
          <div className="bg-white rounded-lg shadow p-6 w-full flex flex-col items-center">
            <div className="text-2xl font-bold mb-4">Add User</div>
            <div className="text-gray-500">(Add user form or functionality here)</div>
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
            setSelectedMatchProfile('');
          }} 
        />
      )}
    </div>
  );
};

export default MediatorDashboard;