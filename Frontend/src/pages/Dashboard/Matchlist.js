import React, { useState } from 'react';
import '../../App.css';
import { mockProfiles } from '../../data/mockdata';
import ProfileDetailsModal from '../../components/dashboard/ProfileDetailsModal';
import NotificationBanner from '../../components/NotificationBanner';

const Matchlist = ({ sentInterests = [], likedProfiles = [], directChatProfiles = [], onNavigate = (path) => {} }) => {
  const [activeTab, setActiveTab] = useState('sent');
  const [chatProfile, setChatProfile] = useState(() => {
    // Restore chat profile from localStorage if available
    const saved = localStorage.getItem('chatProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatMinimized, setIsChatMinimized] = useState(() => {
    // Restore minimized state from localStorage
    return localStorage.getItem('isChatMinimized') === 'true';
  });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = localStorage.getItem('userId');

  // Defensive: always treat IDs as numbers for comparison
  const sentProfiles = mockProfiles.filter(p => sentInterests.map(Number).includes(Number(p.id)));
  const likedProfilesList = mockProfiles.filter(p => likedProfiles.map(Number).includes(Number(p.id)));

  const handleOpenChat = (profile) => {
    setChatProfile(profile);
    setChatMessages([]); // Reset messages for new chat
    setChatInput('');
    setIsChatMinimized(false);
    localStorage.setItem('chatProfile', JSON.stringify(profile));
    localStorage.setItem('isChatMinimized', 'false');
  };
  const handleCloseChat = () => {
    setChatProfile(null);
    setChatMessages([]);
    setChatInput('');
    localStorage.removeItem('chatProfile');
    localStorage.setItem('isChatMinimized', 'false');
  };
  const handleMinimizeChat = () => {
    setIsChatMinimized(true);
    localStorage.setItem('isChatMinimized', 'true');
  };
  const handleRestoreChat = () => {
    setIsChatMinimized(false);
    localStorage.setItem('isChatMinimized', 'false');
  };

  const handleInputChange = (e) => {
    setChatInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    setChatMessages((prev) => [...prev, { text: chatInput, sender: 'me' }]);
    setChatInput('');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const renderProfiles = (profiles, emptyMsg, showChat = false) => {
    if (mockProfiles.length === 0) {
      return <div className="text-gray-500 text-center py-8">No profiles available.</div>;
    }
    if (profiles.length > 0) {
      return (
        <ul className="divide-y">
          {profiles.map(profile => (
            <li key={profile.id} className="py-4 flex items-center space-x-4">
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-200 cursor-pointer"
                onClick={() => handleProfileClick(profile)}
              />
              <div className="flex-1 cursor-pointer" onClick={() => handleProfileClick(profile)}>
                <div className="font-bold text-lg text-gray-800">{profile.name}</div>
                <div className="text-gray-500">{profile.age} yrs, {profile.city}, {profile.state}</div>
              </div>
              {showChat && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold ml-4"
                  onClick={() => handleOpenChat(profile)}
                >
                  Chat
                </button>
              )}
            </li>
          ))}
        </ul>
      );
    }
    return <div className="text-gray-500 text-center py-8">{emptyMsg}</div>;
  };

  return (
    <>
      <NotificationBanner userId={userId} />
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
                ? renderProfiles(sentProfiles, 'No sent interests yet.', true)
                : renderProfiles(likedProfilesList, 'No liked profiles yet.')}
            </div>
          </div>
          {/* Chat Box at Bottom Right */}
          {chatProfile && !isChatMinimized && (
            <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full shadow-xl">
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-96">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-blue-500 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <img src={chatProfile.photos[0]} alt={chatProfile.name} className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                    <span className="text-white font-semibold">Chat with {chatProfile.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-white text-xl font-bold hover:text-gray-200" onClick={handleMinimizeChat} title="Minimize">&#8211;</button>
                    <button className="text-white text-2xl font-bold hover:text-gray-200" onClick={handleCloseChat} title="Close">&times;</button>
                  </div>
                </div>
                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {chatMessages.length === 0 ? (
                    <div className="text-gray-400 flex items-center justify-center h-full">No messages yet.</div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className="flex justify-end">
                          <div className="bg-blue-500 text-white px-3 py-2 rounded-lg max-w-[70%] text-sm shadow">
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Input Area */}
                <div className="p-3 border-t bg-gray-50">
                  <input
                    className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    autoFocus
                  />
                  <button
                    className={`bg-blue-500 text-white px-4 py-2 rounded w-full font-semibold transition ${chatInput.trim() ? 'hover:bg-blue-600' : 'opacity-60 cursor-not-allowed'}`}
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Minimized Chat Floating Button */}
          {chatProfile && isChatMinimized && (
            <button
              className="fixed bottom-6 right-6 z-50 bg-blue-500 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl border-4 border-white hover:bg-blue-600 transition"
              onClick={handleRestoreChat}
              title={`Chat with ${chatProfile.name}`}
            >
              <span role="img" aria-label="Chat">💬</span>
            </button>
          )}
          {/* Profile Details Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="relative w-full max-w-2xl mx-auto">
                <ProfileDetailsModal
                  profile={selectedProfile}
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Matchlist; 