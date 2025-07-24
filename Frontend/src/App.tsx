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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
            await axios.post(`http://localhost:5000/users/interests/${profileId}`, { paymentAmount: 199 }, {
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

  // Fetch notifications for the logged-in user
  const fetchNotifications = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/notifications/for/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Process notifications to ensure metadata is properly structured
      const processedNotifications = res.data.map((notif: any) => ({
        ...notif,
        interestId: notif.metadata?.interestId || notif.interestId,
        senderId: notif.metadata?.senderId || notif.from,
        timestamp: notif.metadata?.timestamp || notif.createdAt
      }));
      
      setNotifications(processedNotifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setNotifications([]);
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

  // Fetch notifications on login
  useEffect(() => {
    if (isLoggedIn) fetchNotifications();
  }, [isLoggedIn]);

  // Socket.io notification listener
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const socket = io('http://localhost:5000');
    if (userId) {
      socket.emit('join', userId);
    }
    socket.on('notification:new', (data) => {
      setToastMsg(data.message);
      setShowToast(true);
      fetchNotifications(); // Refresh notifications
      setTimeout(() => setShowToast(false), 4000);
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

  // Update sendInterest to use new endpoint
  const sendInterest = async (profileId: string, paymentAmount: number = 199) => {
    try {
      const response = await axios.post(`http://localhost:5000/users/interests/${profileId}`, { paymentAmount }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Optionally update sentInterests from /users/interactions
      loadUserInteractions();
      return true;
    } catch (error) {
      console.error('Failed to send interest:', error);
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

  // Calculate unread notifications (optionally, filter by read status if available)
  const unreadNotifications = notifications.length; // You can refine this if you add a 'read' field

  // Notification click handler
  const handleNotificationClick = (notif: any) => {
    if (notif.title === 'New Interest Received' && notif.from && notif.interestId) {
      navigate(`/dashboard/profile/${notif.from}?interestId=${notif.interestId}`);
    } else if (notif.title === 'New Interest Received' && notif.from) {
      navigate(`/dashboard/profile/${notif.from}`);
    }
    // Optionally, mark as read or handle other notification types
  };

  // Accept/Reject handlers for interest notifications
  const [notifLoading, setNotifLoading] = useState<Record<string, boolean>>({});

  const handleAcceptInterest = async (notif: any) => {
    const interestId = notif.metadata?.interestId || notif.interestId;
    if (!interestId) {
      setToastMsg('Invalid notification: No interest ID found');
      setShowToast(true);
      return;
    }

    setNotifLoading(l => ({ ...l, [interestId + '_accept']: true }));
    try {
      await axios.post(`http://localhost:5000/users/interests/${interestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Force reload notifications immediately
      await fetchNotifications();
      
      setToastMsg('Interest accepted!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error('Error accepting interest:', err);
      setToastMsg(err.response?.data?.msg || 'Failed to accept interest.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setNotifLoading(l => ({ ...l, [interestId + '_accept']: false }));
    }
  };

  const handleRejectInterest = async (notif: any) => {
    if (!notif.interestId) return;
    setNotifLoading(l => ({ ...l, [notif.interestId + '_reject']: true }));
    try {
      await axios.post(`http://localhost:5000/users/interests/${notif.interestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setToastMsg('Interest rejected.');
      setShowToast(true);
      fetchNotifications();
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMsg('Failed to reject interest.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setNotifLoading(l => ({ ...l, [notif.interestId + '_reject']: false }));
    }
  };

  // Enhance notifications with loading state for Accept/Reject
  const enhancedNotifications = (notifications as any[]).map(n =>
    n.title === 'New Interest Received' && n.interestId
      ? { ...n, loadingAccept: !!notifLoading[n.interestId + '_accept'], loadingReject: !!notifLoading[n.interestId + '_reject'] }
      : n
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="App">
      <Navbar
        onNavigate={navigate}
        onLogout={handleLogout}
        isManager={isManager}
        unreadCount={unreadNotifications}
        notifications={enhancedNotifications}
        onNotificationClick={handleNotificationClick}
        onAcceptInterest={handleAcceptInterest}
        onRejectInterest={handleRejectInterest}
      />
      {/* Toast */}
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
          </PrivateRoute>
        } />
        <Route path="/dashboard/profile/:id" element={<ProfileDetailsModalWrapper onActionDone={loadUserInteractions} />} />
        <Route path="/matchlist" element={
          <PrivateRoute>
            <main className="flex-grow pb-8">
              <Matchlist
                sentInterests={sentInterests}
                likedProfiles={likedProfiles}
                directChatProfiles={directChatProfiles}
                onNavigate={() => navigate}
              />
            </main>
          </PrivateRoute>
        } />
        <Route path="/edit-profile" element={
          <PrivateRoute>
            <main className="flex-grow pb-8">
              {isManager ? <ManagerProfilePage onProfileComplete={handleManagerProfileComplete} /> : <EditProfilePage />}
            </main>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <main className="flex-grow pb-8">
              <SettingsPage />
            </main>
          </PrivateRoute>
        } />
        <Route path="/manager" element={
          <PrivateRoute>
            <main className="flex-grow pb-8">
              <ManagerProfileViewEdit />
            </main>
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
