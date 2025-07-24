import React, { useState, useEffect, useRef } from 'react';
import '../../App.css';
import ProfileDetailsModal from '../../components/dashboard/ProfileDetailsModal';
import NotificationBanner from '../../components/NotificationBanner';
import PaymentModal from '../payments-FAQ/PaymentModal';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import io from 'socket.io-client';
import { FaLock, FaInfoCircle, FaRupeeSign } from 'react-icons/fa';

const getPhotoUrl = (photo) => {
  if (!photo) return '/default-profile.png';
  return photo.startsWith('/uploads') ? `http://localhost:5000${photo}` : photo;
};

function Matchlist({ sentInterests = [], likedProfiles = [], directChatProfiles = [], onNavigate = (path) => {} }) {
  const userId = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('sent');
  const [chatProfile, setChatProfile] = useState(() => {
    const saved = localStorage.getItem('chatProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatMinimized, setIsChatMinimized] = useState(() => {
    return localStorage.getItem('isChatMinimized') === 'true';
  });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [upgradeProfile, setUpgradeProfile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [otherOnline, setOtherOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const typingTimeout = useRef();
  const [deliveredMap, setDeliveredMap] = useState({});
  const [readMap, setReadMap] = useState({});
  const [filePreview, setFilePreview] = useState(null);
  const [otherViewing, setOtherViewing] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [chatLockedMsg, setChatLockedMsg] = useState('');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showActionToast, setShowActionToast] = useState(false);
  const [actionToastMsg, setActionToastMsg] = useState('');

  // Chat unlock logic: Only allow chat if both users have accepted and at least one interest has paymentAmount 3000
  const [canChat, setCanChat] = useState(false);
  useEffect(() => {
    const checkChatUnlock = async () => {
      if (!chatProfile || !userId) {
        setCanChat(false);
        setChatLockedMsg('');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        // Get all interests between the two users
        const [myInterestRes, theirInterestRes] = await Promise.all([
          axios.get(`http://localhost:5000/interests/incoming`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/interests/sent`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        // My incoming: from them to me, Their sent: from me to them
        const incoming = myInterestRes.data.filter(i => String(i.from._id || i.from) === String(chatProfile._id));
        const sent = theirInterestRes.data.filter(i => String(i.to._id || i.to) === String(chatProfile._id));
        const all = [...incoming, ...sent];
        const bothAccepted = all.filter(i => i.status === 'accepted').length === 2;
        const has3000 = all.some(i => i.status === 'accepted' && i.paymentAmount === 3000);
        setCanChat(bothAccepted && has3000);
        if (!(bothAccepted && has3000)) {
          setChatLockedMsg('Chat is locked. Both users must accept and at least one must pay ₹3000 to unlock chat.');
        } else {
          setChatLockedMsg('');
        }
      } catch (err) {
        setCanChat(false);
        setChatLockedMsg('Chat is locked. Both users must accept and at least one must pay ₹3000 to unlock chat.');
      }
    };
    checkChatUnlock();
  }, [chatProfile, userId]);

  const socketRef = useRef();

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('token');
            onNavigate('/login');
            throw new Error('Please login again');
          }
          throw new Error(`Server returned ${response.status}`);
        }
        
        const data = await response.json();
        setAllProfiles(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Failed to fetch profiles:', err);
        setError('Failed to load profiles. Please try again.');
        setAllProfiles([]); // Clear profiles on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [onNavigate]);

  // Ensure all sentInterests profiles are loaded
  useEffect(() => {
    const fetchMissingProfiles = async () => {
      for (const id of sentInterests) {
        if (!allProfiles.some(p => String(p._id) === String(id))) {
          try {
            const userRes = await axios.get(`http://localhost:5000/users/${id}`);
            setAllProfiles(prev => {
              if (prev.some(p => String(p._id) === String(id))) return prev;
              return [...prev, userRes.data];
            });
          } catch (err) {}
        }
      }
    };
    if (sentInterests && sentInterests.length > 0) {
      fetchMissingProfiles();
    }
  }, [sentInterests]);

  useEffect(() => {
    // Connect to Socket.IO server
    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    if (userId) {
      socket.emit('join', userId);
    }
    socket.on('chat:newMessage', ({ chatId, message, from, to }) => {
      if (chatProfile && (from === chatProfile._id || to === chatProfile._id)) {
        setChatMessages((prev) => {
          // De-duplicate by timestamp and text
          if (prev.some(m => m.timestamp === message.timestamp && m.text === message.text && m.sender === message.sender)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });
    // Delivery/read receipts
    socket.on('chat:delivered', ({ chatId, message }) => {
      setDeliveredMap((prev) => ({ ...prev, [message.timestamp]: true }));
    });
    socket.on('chat:read', ({ chatId, userId: readerId }) => {
      setReadMap((prev) => ({ ...prev, [readerId]: true }));
    });
    // Typing indicator
    socket.on('chat:typing', ({ from }) => {
      if (chatProfile && from === chatProfile._id) setOtherTyping(true);
    });
    socket.on('chat:stopTyping', ({ from }) => {
      if (chatProfile && from === chatProfile._id) setOtherTyping(false);
    });
    // Presence
    socket.on('presence:update', ({ userId: uid, online, lastSeen }) => {
      if (chatProfile && uid === chatProfile._id) {
        setOtherOnline(online);
        if (!online) setLastSeen(lastSeen);
      }
    });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [userId, chatProfile && chatProfile._id]);

// Emit read event when chat is opened or chatMessages change
useEffect(() => {
  if (chatProfile && chatProfile._id) {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/chats/${chatProfile._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChatMessages(res.data || []);
      } catch (err) {
        setChatMessages([]);
      }
    })();
  }
  // eslint-disable-next-line
}, [chatProfile && chatProfile._id]);

  // Defensive: always treat IDs as numbers for comparison
  const sentProfiles = allProfiles.filter(p => sentInterests.map(String).includes(String(p._id)));
  const likedProfilesList = allProfiles.filter(p => likedProfiles.map(String).includes(String(p._id)));

  // Debug logs
  console.log('sentInterests:', sentInterests);
  console.log('allProfiles:', allProfiles);
  console.log('sentProfiles:', sentProfiles);

  const handleOpenChat = async (profile) => {
    setChatProfile(profile);
    setIsChatMinimized(false);
    setChatInput('');
    localStorage.setItem('chatProfile', JSON.stringify(profile));
    localStorage.setItem('isChatMinimized', 'false');
    // Fetch chat history from backend
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/chats/${profile._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatMessages(res.data || []);
      setChatLockedMsg('');
    } catch (err) {
      if (err.response && err.response.status === 403 && err.response.data && err.response.data.msg) {
        setChatMessages(null);
        setChatLockedMsg(err.response.data.msg);
      } else {
        setChatMessages([]);
        setChatLockedMsg('');
      }
    }
  };
  const handleCloseChat = () => {
    setChatProfile(null);
    setChatMessages([]);
    setChatInput('');
    localStorage.removeItem('chatProfile');
    localStorage.setItem('isChatMinimized', 'false');
  };
  const handleMinimizeChat = () => setIsChatMinimized(true);
  const handleRestoreChat = () => setIsChatMinimized(false);

  const handleInputChange = (e) => {
    setChatInput(e.target.value);
    if (!isTyping && chatProfile) {
      setIsTyping(true);
      socketRef.current.emit('typing', { to: chatProfile._id, from: userId });
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      if (chatProfile) {
        socketRef.current.emit('stopTyping', { to: chatProfile._id, from: userId });
      }
    }, 1200);
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === '' || !chatProfile) return;
    const newMessage = { text: chatInput, sender: userId, timestamp: new Date() };
    setChatInput('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/chats/${chatProfile._id}/message`, { text: newMessage.text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Do NOT update setChatMessages here!
    } catch (err) {
      // Optionally show error
    }
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

  const handleSendInterest = (profileId) => {
    console.log('Send interest for profileId:', profileId);
    // TODO: Call the actual API or prop to send interest
  };

  const handleUpgradeToDirectChat = (profile) => {
    setUpgradeProfile(profile);
    setShowPaymentModal(true);
  };
  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setUpgradeProfile(null);
  };

  const handleEmojiClick = (emojiData) => {
    setChatInput(chatInput + emojiData.native);
    setShowEmojiPicker(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatProfile) return;
    // Show preview
    if (file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(file.name);
    }
    setFileUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(`http://localhost:5000/chats/${chatProfile._id}/file`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh chat messages after upload
      const res = await axios.get(`http://localhost:5000/chats/${chatProfile._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatMessages(res.data || []);
      setFilePreview(null);
    } catch (err) {
      // Optionally show error
      setFilePreview(null);
    }
    setFileUploading(false);
  };

  const handleEditMessage = (msg) => {
    setEditingMsgId(msg._id);
    setEditingText(msg.text);
  };
  const handleSaveEdit = async (msg) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/chats/${chatProfile._id}/message/${msg._id}`, { text: editingText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh chat messages
      const res = await axios.get(`http://localhost:5000/chats/${chatProfile._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatMessages(res.data || []);
      setEditingMsgId(null);
      setEditingText('');
    } catch (err) {}
  };
  const handleDeleteMessage = async (msg) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/chats/${chatProfile._id}/message/${msg._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh chat messages
      const res = await axios.get(`http://localhost:5000/chats/${chatProfile._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatMessages(res.data || []);
    } catch (err) {}
  };

  // Helper to check if chat is locked (based on chatLockedMsg)
  const isChatLocked = !!chatLockedMsg;

  // Accept/Reject handlers (to show toast)
  const handleAcceptInterest = async (interestId) => {
    try {
      const token = localStorage.getItem('token');
      // Call backend to accept interest
      await axios.post(`http://localhost:5000/users/interests/${interestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setActionToastMsg('Interest accepted!');
      setShowActionToast(true);
      
      // After accepting, fetch sentInterests and ensure all profiles are loaded
      const res = await axios.get('http://localhost:5000/users/interactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newSentInterests = res.data.sentInterests || [];
      // For any new sent interest not in allProfiles, fetch and add
      for (const id of newSentInterests) {
        if (!allProfiles.some(p => String(p._id) === String(id))) {
          const userRes = await axios.get(`http://localhost:5000/users/${id}`);
          setAllProfiles(prev => [...prev, userRes.data]);
        }
      }
      setTimeout(() => setShowActionToast(false), 2500);
    } catch (err) {
      console.error(err);
      setActionToastMsg('Failed to accept interest');
      setShowActionToast(true);
    }
  };
  const handleRejectInterest = async (interestId) => {
    try {
      const token = localStorage.getItem('token');
      // Call backend to reject interest
      await axios.post(`http://localhost:5000/users/interests/${interestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setActionToastMsg('Interest rejected.');
      setShowActionToast(true);
      setTimeout(() => setShowActionToast(false), 2500);
    } catch (err) {
      console.error(err);
      setActionToastMsg('Failed to reject interest');
      setShowActionToast(true);
    }
  };

  const renderProfiles = (profiles, emptyMsg, showChat = false) => {
    if (allProfiles.length === 0) {
      return <div className="text-gray-500 text-center py-8">No profiles available.</div>;
    }
    if (profiles.length > 0) {
      return (
        <ul className="divide-y">
          {profiles.map(profile => {
            const hasDirectChat = directChatProfiles.map(String).includes(String(profile._id));
            return (
              <li key={profile._id} className="py-4 flex items-center space-x-4">
                <img
                  src={getPhotoUrl(profile.photos && profile.photos[0])}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-orange-200 cursor-pointer"
                  onClick={() => handleProfileClick(profile)}
                />
                <div className="flex-1 cursor-pointer" onClick={() => handleProfileClick(profile)}>
                  <div className="font-bold text-lg text-gray-800">{profile.name}</div>
                  <div className="text-gray-500">{profile.age} yrs, {profile.city}, {profile.state}</div>
                </div>
                            {hasDirectChat && canChat ? (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold ml-4"
                    onClick={() => handleOpenChat(profile)}
                    disabled={isChatLocked}
                    title={isChatLocked ? 'Chat is locked until both accept and pay ₹3000' : ''}
                  >
                    Chat
                  </button>
                ) : (
                  <button
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold ml-4"
                    onClick={() => handleUpgradeToDirectChat(profile)}
                  >
                    Upgrade to Direct Chat
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      );
    }
    return <div className="text-gray-500 text-center py-8">{emptyMsg}</div>;
  };

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    if (!socketRef.current) return;
    socketRef.current.on('chat:newMessage', ({ chatId, message, from, to }) => {
      if (document.hidden && from !== userId) {
        new Notification('New message', {
          body: message.text || 'You have a new message',
          icon: '/logo192.png',
        });
      }
    });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
            <div className="fixed bottom-6 right-6 z-50 w-96 max-w-full shadow-2xl rounded-3xl overflow-hidden border border-gray-200 bg-white animate-fade-in flex flex-col" style={{ height: 500 }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-3xl shadow-md">
                <div className="flex items-center gap-3">
                  <img src={getPhotoUrl(chatProfile.photos && chatProfile.photos[0])} alt={chatProfile.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                  <span className="text-white font-bold text-lg">{chatProfile.name}</span>
                  {otherOnline ? (
                    <span className="ml-2 text-green-200 text-xs font-semibold">● Online</span>
                  ) : lastSeen ? (
                    <span className="ml-2 text-gray-200 text-xs">Last seen {new Date(lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-white text-xl font-bold hover:text-indigo-200 transition" onClick={handleMinimizeChat} title="Minimize">&#8211;</button>
                  <button className="text-white text-2xl font-bold hover:text-indigo-200 transition" onClick={handleCloseChat} title="Close">&times;</button>
                </div>
              </div>
              {/* Chat Lock Message or Messages Area */}
              {!canChat ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <FaLock size={48} className="text-orange-400 mb-4" />
                  <div className="text-orange-600 font-semibold text-lg mb-2">Chat Locked</div>
                  <div className="text-gray-700 mb-4">Both users must accept and at least one must pay <FaRupeeSign className="inline" />3000 to unlock chat.</div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 mb-2" onClick={() => setShowUnlockModal(true)}>
                    <FaInfoCircle /> How to Unlock
                  </button>
                  {/* If only 199 was paid, show upgrade button */}
                  {/* You may need to check payment status from interests */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600" onClick={() => handleUpgradeToDirectChat(chatProfile)}>
                    <FaRupeeSign /> Upgrade to ₹3000
                  </button>
                </div>
              ) : chatMessages !== null ? (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 p-5 overflow-y-auto bg-gradient-to-br from-gray-50 to-white" style={{ minHeight: 0, maxHeight: 340 }}>
                    {chatMessages.length === 0 ? (
                      <div className="text-gray-400 flex items-center justify-center h-full">No messages yet.</div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {chatMessages.map((msg, idx) => {
                          const isMe = msg.sender === userId || (msg.sender && msg.sender._id === userId);
                          return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end group`}>
                              {!isMe && (
                                <img
                                  src={getPhotoUrl(chatProfile.photos && chatProfile.photos[0])}
                                  alt={chatProfile.name}
                                  className="w-7 h-7 rounded-full object-cover border-2 border-orange-200 mr-2 self-end shadow"
                                />
                              )}
                              <div className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm shadow-lg ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} transition-all duration-150 relative`} style={{ wordBreak: 'break-word' }}>
                                {editingMsgId === msg._id ? (
                                  <div className="flex items-center gap-2">
                                    <input className="border rounded px-2 py-1 text-black" value={editingText} onChange={e => setEditingText(e.target.value)} />
                                    <button className="text-green-600 text-xs" onClick={() => handleSaveEdit(msg)}>Save</button>
                                    <button className="text-gray-400 text-xs" onClick={() => setEditingMsgId(null)}>Cancel</button>
                                  </div>
                                ) : (
                                  <>
                                    {msg.fileUrl ? (
                                      msg.fileType === 'image' ? (
                                        <img src={`http://localhost:5000${msg.fileUrl}`} alt="attachment" className="max-w-[180px] max-h-[180px] rounded-lg mb-1" />
                                      ) : (
                                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{msg.fileUrl}</span>
                                      )
                                    ) : null}
                                    <span>{msg.text}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* Input Area */}
                  <div className="p-4 border-t bg-white flex gap-2 items-center relative">
                    <button
                      className="text-2xl px-2 focus:outline-none hover:bg-gray-100 rounded-full transition"
                      onClick={() => setShowEmojiPicker((v) => !v)}
                      title="Add emoji"
                      type="button"
                    >
                      😊
                    </button>
                    <label className="text-2xl px-2 cursor-pointer hover:bg-gray-100 rounded-full transition" title="Attach file">
                      <input type="file" className="hidden" onChange={handleFileChange} disabled={fileUploading} />
                      <span role="img" aria-label="Attach">📎</span>
                    </label>
                    {fileUploading && <span className="text-xs text-blue-500">Uploading...</span>}
                    {showEmojiPicker && (
                      <div className="absolute bottom-14 left-0 z-50">
                        <Picker onEmojiSelect={handleEmojiClick} theme="light" />
                      </div>
                    )}
                    {filePreview && (
                      <div className="mb-2 flex items-center gap-2">
                        {typeof filePreview === 'string' && filePreview.startsWith('data:') ? (
                          <img src={filePreview} alt="preview" className="max-w-[120px] max-h-[120px] rounded-lg border" />
                        ) : (
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{filePreview}</span>
                        )}
                        <button className="ml-2 text-red-500 text-xs" onClick={() => setFilePreview(null)}>Remove</button>
                      </div>
                    )}
                    <input
                      className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                      placeholder="Type a message..."
                      value={chatInput}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                      autoFocus
                    />
                    <button
                      className={`bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-2xl font-semibold shadow-md transition hover:from-blue-600 hover:to-indigo-600 ${!chatInput.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : null}
              {/* Unlock Modal */}
              {showUnlockModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold mb-4">How to Unlock Chat</h2>
                    <ol className="text-left mb-4 list-decimal list-inside">
                      <li>Send an interest and pay <FaRupeeSign className="inline" />199 or <FaRupeeSign className="inline" />3000.</li>
                      <li>Wait for the other user to accept your interest.</li>
                      <li>If only <FaRupeeSign className="inline" />199 was paid, upgrade to <FaRupeeSign className="inline" />3000 for chat access.</li>
                      <li>Once both have accepted and at least one has paid <FaRupeeSign className="inline" />3000, chat will unlock automatically.</li>
                    </ol>
                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setShowUnlockModal(false)}>Close</button>
                  </div>
                </div>
              )}
              {/* Action Toast */}
              {showActionToast && (
                <div className="fixed bottom-24 right-8 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
                  {actionToastMsg}
                </div>
              )}
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
          {/* Payment Modal for Upgrade to Direct Chat */}
          {showPaymentModal && (
            <PaymentModal
              show={showPaymentModal}
              onClose={handlePaymentClose}
              profileId={upgradeProfile ? (upgradeProfile._id || upgradeProfile.id) : null}
              onSelectPayment={() => {}}
              hasSentInterest={upgradeProfile ? sentInterests.includes(upgradeProfile._id || upgradeProfile.id) : false}
            />
          )}
          {otherViewing && (
            <div className="text-xs text-green-500 px-5 pb-1 animate-pulse">User is viewing this chat</div>
          )}
        </main>
      </div>
    </>
  );
};

// Typing animation (animated dots)
const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 pb-2">
    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
  </div>
);

export default Matchlist; 