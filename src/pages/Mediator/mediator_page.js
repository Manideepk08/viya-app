import React, { useState } from 'react';

const MediatorDashboard = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [selectedMatchProfile, setSelectedMatchProfile] = useState('');
  const [showCommissionTracker, setShowCommissionTracker] = useState(false);

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Age:</span> {profile.age} years</p>
                <p><span className="font-medium">Location:</span> {profile.location}</p>
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

          {/* Matching Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Add Potential Match</h3>
            <div className="flex gap-3">
              <select
                value={selectedMatchProfile}
                onChange={(e) => setSelectedMatchProfile(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="">Select a profile to match</option>
                {availableProfiles.map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name} ({profile.age} years, {profile.location}, {profile.education})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddMatch}
                disabled={!selectedMatchProfile}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Match
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Update Status
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              View Matches
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              Contact Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MatchRequestCard = ({ request }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{request.from} ↔ {request.to}</h3>
        <p className="text-gray-600">Date: {request.date}</p>
      </div>
      <div className="flex space-x-2">
        <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          Accept
        </button>
        <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
          Reject
        </button>
        <span className={`px-3 py-1 rounded-full text-sm ${
          request.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}>
          {request.status}
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mediator Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match Requests - Left Column */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Match Requests</h2>
            <div className="space-y-4">
              {matchRequests.map(request => (
                <MatchRequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>

          {/* Assigned Profiles - Center and Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Male Profiles */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-3">Male</span>
                Assigned Male Profiles ({maleProfiles.length})
              </h2>
              <div className="space-y-4">
                {maleProfiles.map(profile => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
                {maleProfiles.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No male profiles assigned yet.</p>
                )}
              </div>
            </div>

            {/* Female Profiles */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm mr-3">Female</span>
                Assigned Female Profiles ({femaleProfiles.length})
              </h2>
              <div className="space-y-4">
                {femaleProfiles.map(profile => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
                {femaleProfiles.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No female profiles assigned yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Commission Tracker - Expandable Box */}
        <div className="mt-6 bg-gray-50 rounded-lg shadow-md">
          <button
            onClick={() => setShowCommissionTracker(!showCommissionTracker)}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-700">Commission Tracker</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {commissions.filter(c => c.status === "Paid").length} Paid | 
                {commissions.filter(c => c.status === "Pending").length} Pending | 
                {commissions.filter(c => c.status === "Failed").length} Failed
              </span>
              <svg 
                className={`w-5 h-5 text-gray-600 transition-transform ${showCommissionTracker ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {showCommissionTracker && (
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {commissions.map(commission => (
                  <CommissionCard key={commission.id} commission={commission} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Match Status Update */}
        <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Match Status</h2>
          <div className="flex space-x-4">
            <select className="p-2 border rounded-lg">
              <option>Select Profile</option>
              {assignedProfiles.map(profile => (
                <option key={profile.id} value={profile.id}>{profile.name}</option>
              ))}
            </select>
            <select className="p-2 border rounded-lg">
              <option>Select Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Update Status
            </button>
          </div>
        </div>
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