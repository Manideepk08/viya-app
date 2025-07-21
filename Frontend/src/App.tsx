import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WelcomePage from './pages/welcomepages-main/WelcomePage';
import ProfilePage from './pages/intro+profile/ProfilePage';
import IntroProfileApp from './pages/intro+profile/intro_profile';
import UnifiedDashboardPage from './pages/Dashboard/UnifiedDashboardPage';
import Matchlist from './pages/Dashboard/Matchlist';
import EditProfilePage from './pages/Dashboard/EditProfilePage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import ManagerProfilePage from './pages/Manager/ManagerProfilePage';
import ManagerProfileViewEdit from './pages/Manager/ManagerProfileViewEdit';
import AdminDashboard from './pages/admin/AdminDashboard';
import PaymentMethods from './pages/payments-FAQ/payment_methods';
import HelpFAQ from './pages/payments-FAQ/HelpFAQ';
import PrivateRoute from './PrivateRoute';
import './App.css';
import Navbar from './components/dashboard/navbar';
import ProfileDetailsModalWrapper from './pages/Dashboard/ProfileDetailsModalWrapper';
import io from 'socket.io-client';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [sentInterests, setSentInterests] = useState<string[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [directChatProfiles, setDirectChatProfiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const openChatIdRef = useRef(null); // Track currently open chat

  // Load user interactions from MongoDB
  const loadUserInteractions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      console.log('Loading user interactions from MongoDB...');
      const response = await axios.get('http://localhost:5000/users/interactions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('MongoDB response:', response.data);
      
      const sentInterestsData = response.data.sentInterests || [];
      const likedProfilesData = response.data.likedProfiles || [];
      const directChatProfilesData = response.data.directChatProfiles || [];

      // Check if we need to migrate from localStorage
      const storedSentInterests = JSON.parse(localStorage.getItem('sentInterests') || '[]');
      const storedLikedProfiles = JSON.parse(localStorage.getItem('likedProfiles') || '[]');
      const storedDirectChatProfiles = JSON.parse(localStorage.getItem('directChatProfiles') || '[]');

      // If MongoDB is empty but localStorage has data, migrate it
      if (sentInterestsData.length === 0 && storedSentInterests.length > 0) {
        console.log('Migrating sentInterests from localStorage to MongoDB...');
        for (const profileId of storedSentInterests) {
          try {
            await axios.post(`http://localhost:5000/users/send-interest/${profileId}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (error) {
            console.error(`Failed to migrate sentInterest ${profileId}:`, error);
          }
        }
      }

      if (likedProfilesData.length === 0 && storedLikedProfiles.length > 0) {
        console.log('Migrating likedProfiles from localStorage to MongoDB...');
        for (const profileId of storedLikedProfiles) {
          try {
            await axios.post(`http://localhost:5000/users/like/${profileId}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (error) {
            console.error(`Failed to migrate likedProfile ${profileId}:`, error);
          }
        }
      }

      if (directChatProfilesData.length === 0 && storedDirectChatProfiles.length > 0) {
        console.log('Migrating directChatProfiles from localStorage to MongoDB...');
        for (const profileId of storedDirectChatProfiles) {
          try {
            await axios.post(`http://localhost:5000/users/direct-chat/${profileId}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (error) {
            console.error(`Failed to migrate directChatProfile ${profileId}:`, error);
          }
        }
      }

      // Reload data after migration
      const updatedResponse = await axios.get('http://localhost:5000/users/interactions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const finalSentInterests = updatedResponse.data.sentInterests || [];
      const finalLikedProfiles = updatedResponse.data.likedProfiles || [];
      const finalDirectChatProfiles = updatedResponse.data.directChatProfiles || [];

      console.log('Setting state with final data:', {
        sentInterests: finalSentInterests,
        likedProfiles: finalLikedProfiles,
        directChatProfiles: finalDirectChatProfiles
      });

      setSentInterests(finalSentInterests);
      setLikedProfiles(finalLikedProfiles);
      setDirectChatProfiles(finalDirectChatProfiles);

      // Clear localStorage after successful migration
      if (finalSentInterests.length > 0 || finalLikedProfiles.length > 0 || finalDirectChatProfiles.length > 0) {
        localStorage.removeItem('sentInterests');
        localStorage.removeItem('likedProfiles');
        localStorage.removeItem('directChatProfiles');
        console.log('Cleared localStorage after successful migration');
      }
    } catch (error) {
      console.error('Failed to load user interactions:', error);
      // Fallback to localStorage if API fails
      const storedSentInterests = JSON.parse(localStorage.getItem('sentInterests') || '[]');
      const storedLikedProfiles = JSON.parse(localStorage.getItem('likedProfiles') || '[]');
      const storedDirectChatProfiles = JSON.parse(localStorage.getItem('directChatProfiles') || '[]');
      
      console.log('Falling back to localStorage:', {
        sentInterests: storedSentInterests,
        likedProfiles: storedLikedProfiles,
        directChatProfiles: storedDirectChatProfiles
      });
      
      setSentInterests(storedSentInterests);
      setLikedProfiles(storedLikedProfiles);
      setDirectChatProfiles(storedDirectChatProfiles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for token in local storage on app load
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
      loadUserInteractions();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const socket = io('http://localhost:5000');
    if (userId) {
      socket.emit('join', userId);
    }
    socket.on('chat:newMessage', ({ chatId, message, from, to }) => {
      if (from !== userId && !isChatOpen(chatId)) {
        setUnreadCount((c) => c + 1);
        setToastMsg(`New message from ${message.senderName || 'someone'}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    });
    return () => { socket.disconnect(); };
  }, []);

  // Helper to check if a chat is open
  const isChatOpen = (chatId: string) => openChatIdRef.current === chatId;

  // API functions for user interactions
  const likeProfile = async (profileId: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/users/like/${profileId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLikedProfiles(response.data.likedProfiles);
      return response.data.isLiked;
    } catch (error) {
      console.error('Failed to like profile:', error);
      // Fallback to local state update
      setLikedProfiles(prev => 
        prev.includes(profileId) 
          ? prev.filter(id => id !== profileId)
          : [...prev, profileId]
      );
      return !likedProfiles.includes(profileId);
    }
  };

  const sendInterest = async (profileId: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/users/send-interest/${profileId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSentInterests(response.data.sentInterests);
      return true;
    } catch (error) {
      console.error('Failed to send interest:', error);
      // Fallback to local state update
      if (!sentInterests.includes(profileId)) {
        setSentInterests(prev => [...prev, profileId]);
      }
      return false;
    }
  };

  const addDirectChatProfile = async (profileId: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/users/direct-chat/${profileId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDirectChatProfiles(response.data.directChatProfiles);
      return true;
    } catch (error) {
      console.error('Failed to add direct chat profile:', error);
      // Fallback to local state update
      if (!directChatProfiles.includes(profileId)) {
        setDirectChatProfiles(prev => [...prev, profileId]);
      }
      return false;
    }
  };

  const handleProfileComplete = (isManager: boolean) => {
    setIsLoggedIn(true);
    if (isManager) {
      navigate('/manager');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    // Clear token and auth headers
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setIsManager(false);
    // Clear user interactions from state (they'll be reloaded on next login)
    setSentInterests([]);
    setLikedProfiles([]);
    setDirectChatProfiles([]);
    navigate('/');
  };

  const handleManagerProfileComplete = () => {
    setIsLoggedIn(true);
    navigate('/manager');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="App">
      {showToast && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMsg}
        </div>
      )}
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">{unreadCount}</span>
      )}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/intro-profile" element={<IntroProfileApp onProfileComplete={handleProfileComplete} isManager={false} />} />
        <Route path="/profile" element={<ProfilePage onProfileComplete={handleProfileComplete} />} />
        <Route path="/help-faq" element={<HelpFAQ />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <>
              <Navbar onNavigate={navigate} onLogout={handleLogout} isManager={isManager} unreadCount={unreadCount} />
              <main className="flex-grow pb-8">
                <UnifiedDashboardPage
                  sentInterests={sentInterests}
                  setSentInterests={setSentInterests}
                  likedProfiles={likedProfiles}
                  setLikedProfiles={setLikedProfiles}
                  directChatProfiles={directChatProfiles}
                  setDirectChatProfiles={setDirectChatProfiles}
                  onNavigate={navigate}
                  likeProfile={likeProfile}
                  sendInterest={sendInterest}
                  addDirectChatProfile={addDirectChatProfile}
                />
              </main>
            </>
          </PrivateRoute>
        } />
        <Route path="/dashboard/profile/:id" element={<ProfileDetailsModalWrapper />} />
        <Route path="/matchlist" element={
          <PrivateRoute>
            <>
              <Navbar onNavigate={navigate} onLogout={handleLogout} isManager={isManager} unreadCount={unreadCount} />
              <main className="flex-grow pb-8">
                <Matchlist
                  sentInterests={sentInterests}
                  likedProfiles={likedProfiles}
                  directChatProfiles={directChatProfiles}
                  onNavigate={() => navigate}
                />
              </main>
            </>
          </PrivateRoute>
        } />
        <Route path="/edit-profile" element={
          <PrivateRoute>
            <>
              <Navbar onNavigate={navigate} onLogout={handleLogout} isManager={isManager} unreadCount={unreadCount} />
              <main className="flex-grow pb-8">
                {isManager ? <ManagerProfilePage onProfileComplete={handleManagerProfileComplete} /> : <EditProfilePage />}
              </main>
            </>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <>
              <Navbar onNavigate={navigate} onLogout={handleLogout} isManager={isManager} unreadCount={unreadCount} />
              <main className="flex-grow pb-8">
                <SettingsPage />
              </main>
            </>
          </PrivateRoute>
        } />
        <Route path="/manager" element={
          <PrivateRoute>
            <>
              <Navbar onNavigate={navigate} onLogout={handleLogout} isManager={true} unreadCount={unreadCount} />
              <main className="flex-grow pb-8">
                <ManagerProfileViewEdit />
              </main>
            </>
          </PrivateRoute>
        } />
        <Route path="/admin/*" element={
          <PrivateRoute>
            <AdminDashboard onLogout={handleLogout} />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
