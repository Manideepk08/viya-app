import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import IntroProfileApp from './pages/intro+profile/intro_profile';
import Navbar from './components/dashboard/navbar';
import Footer from './components/dashboard/footer';
import UnifiedDashboardPage from './pages/Dashboard/UnifiedDashboardPage';
import EditProfilePage from './pages/Dashboard/EditProfilePage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import ManagerDashboard from './pages/Manager/manager_page';
import ManagerProfilePage from './pages/Manager/ManagerProfilePage';
import PaymentMethods from './pages/payments-FAQ/payment_methods';
import HelpFAQ from './pages/payments-FAQ/HelpFAQ';
import Matchlist from './pages/Dashboard/Matchlist';
import ManagerProfileViewEdit from './pages/Manager/ManagerProfileViewEdit';
import MediatorAssigned from './pages/payments-FAQ/mediator_assigned';
import WelcomePage from './pages/welcomepages-main/WelcomePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserProfilesPage from './pages/admin/userprofilespage';
import MediatorProfilesPage from './pages/admin/MediatorProfilesPage';
import RevenueProfilesPage from './pages/admin/revenueprofilespage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [sentInterests, setSentInterests] = useState([]);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [directChatProfiles, setDirectChatProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in local storage on app load
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
      // You might want to add a call to a '/users/me' endpoint here
      // to verify the token is still valid and get user data.
    }
  }, []);

  // On mount, load directChatProfiles from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('directChatProfiles') || '[]');
    setDirectChatProfiles(stored);
  }, []);

  // Keep localStorage in sync when directChatProfiles changes
  useEffect(() => {
    localStorage.setItem('directChatProfiles', JSON.stringify(directChatProfiles));
  }, [directChatProfiles]);

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
    navigate('/');
  };

  const handleManagerProfileComplete = () => {
    setIsLoggedIn(true);
    navigate('/manager');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-amber-50 antialiased">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/intro-profile" element={<IntroProfileApp onProfileComplete={handleProfileComplete} isManager={false} />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/help-faq" element={<HelpFAQ />} />
        <Route path="/manager-profile-view" element={<ManagerProfileViewEdit />} />
        <Route path="/manager" element={
          <>
            <main className="flex-grow pb-8">
              <ManagerDashboard />
            </main>
          </>
        } />
        <Route path="/manager-assigned" element={<MediatorAssigned />} />
        <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/admin-dashboard" element={<AdminDashboard onLogout={() => { setIsLoggedIn(false); navigate('/'); }} />}>
          <Route path="users" element={<UserProfilesPage />} />
          <Route path="mediators" element={<MediatorProfilesPage />} />
          <Route path="revenue" element={<RevenueProfilesPage />} />
        </Route>
        {isLoggedIn && (
          <>
            <Route path="/dashboard" element={
              <>
                <Navbar onNavigate={navigate} onLogout={handleLogout} isManager={isManager} />
                <main className="flex-grow pb-8">
                  <UnifiedDashboardPage
                    sentInterests={sentInterests}
                    setSentInterests={setSentInterests}
                    likedProfiles={likedProfiles}
                    setLikedProfiles={setLikedProfiles}
                    directChatProfiles={directChatProfiles}
                    setDirectChatProfiles={setDirectChatProfiles}
                    onNavigate={navigate}
                  />
                </main>
              </>
            } />
            <Route path="/matchlist" element={
              <>
                <Navbar onNavigate={navigate} onLogout={handleLogout} isManager={isManager} />
                <main className="flex-grow pb-8">
                  <Matchlist
                    sentInterests={sentInterests}
                    likedProfiles={likedProfiles}
                    directChatProfiles={directChatProfiles}
                    onNavigate={() => navigate}
                  />
                </main>
              </>
            } />
            <Route path="/edit-profile" element={
              <>
                <Navbar onNavigate={navigate} onLogout={handleLogout} isManager={isManager} />
                <main className="flex-grow pb-8">
                  {isManager ? <ManagerProfilePage onProfileComplete={handleManagerProfileComplete} /> : <EditProfilePage />}
                </main>
              </>
            } />
            <Route path="/settings" element={
              <>
                <Navbar onNavigate={navigate} onLogout={handleLogout} isManager={isManager} />
                <main className="flex-grow pb-8">
                  <SettingsPage />
                </main>
              </>
            } />
          </>
        )}
      </Routes>
      <div className="w-full bg-gray-900 text-gray-200 text-center py-2 text-xs mt-12">
        © 2024 Viya Matrimony. All rights reserved.
      </div>
    </div>
  );
}

export default App;
