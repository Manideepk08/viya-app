import React, { useState } from 'react';
import '../../App.css';
import { mockProfiles } from '../../data/mockdata';

const Matchlist = ({ sentInterests = [], likedProfiles = [], onNavigate = (path) => {} }) => {
  const [activeTab, setActiveTab] = useState('sent');

  // Defensive: always treat IDs as numbers for comparison
  const sentProfiles = mockProfiles.filter(p => sentInterests.map(Number).includes(Number(p.id)));
  const likedProfilesList = mockProfiles.filter(p => likedProfiles.map(Number).includes(Number(p.id)));

  const renderProfiles = (profiles, emptyMsg) => {
    if (mockProfiles.length === 0) {
      return <div className="text-gray-500 text-center py-8">No profiles available.</div>;
    }
    if (profiles.length > 0) {
      return (
        <ul className="divide-y">
          {profiles.map(profile => (
            <li key={profile.id} className="py-4 flex items-center space-x-4">
              <img src={profile.photos[0]} alt={profile.name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-200" />
              <div>
                <div className="font-bold text-lg text-gray-800">{profile.name}</div>
                <div className="text-gray-500">{profile.age} yrs, {profile.city}, {profile.state}</div>
              </div>
            </li>
          ))}
        </ul>
      );
    }
    return <div className="text-gray-500 text-center py-8">{emptyMsg}</div>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow flex flex-col items-center justify-start pt-8">
        <div className="bg-white rounded-lg shadow p-6 w-full max-w-3xl">
          <div className="flex space-x-4 mb-6 border-b pb-2">
            <button
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'sent' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-orange-500'}`}
              onClick={() => setActiveTab('sent')}
            >
              Sent Interests
            </button>
            <button
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'likes' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-orange-500'}`}
              onClick={() => setActiveTab('likes')}
            >
              My Likes
            </button>
          </div>
          <div>
            {activeTab === 'sent'
              ? renderProfiles(sentProfiles, 'No sent interests yet.')
              : renderProfiles(likedProfilesList, 'No liked profiles yet.')}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Matchlist; 