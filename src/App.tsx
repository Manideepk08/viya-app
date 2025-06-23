import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import IntroProfileApp from './pages/intro+profile/intro_profile';
import Navbar from './components/dashboard/navbar';
import Footer from './components/dashboard/footer';
import UnifiedDashboardPage from './pages/Dashboard/UnifiedDashboardPage';
import EditProfilePage from './pages/Dashboard/EditProfilePage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import MediatorDashboard from './pages/Mediator/mediator_page';
import MediatorProfilePage from './pages/Mediator/MediatorProfilePage';
import PaymentMethods from './pages/payments-FAQ/payment_methods';
import HelpFAQ from './pages/payments-FAQ/HelpFAQ';
import Matchlist from './pages/Dashboard/Matchlist';
import MediatorProfileViewEdit from './pages/Mediator/MediatorProfileViewEdit';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMediator, setIsMediator] = useState(false);
  const [sentInterests, setSentInterests] = useState([]);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const navigate = useNavigate();

  const handleProfileComplete = (isMediator: boolean) => {
    setIsLoggedIn(true);
    if (isMediator) {
      navigate('/mediator');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMediator(false);
    navigate('/');
  };

  const handleMediatorProfileComplete = () => {
    setIsLoggedIn(true);
    navigate('/mediator');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-amber-50 antialiased">
      <Routes>
        <Route path="/" element={<IntroProfileApp onProfileComplete={handleProfileComplete} isMediator={false} />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/help-faq" element={<HelpFAQ />} />
        <Route path="/mediator-profile-view" element={<MediatorProfileViewEdit />} />
        <Route path="/mediator" element={
          <>
            <main className="flex-grow pb-8">
              <MediatorDashboard />
            </main>
            <Footer />
          </>
        } />
        {isLoggedIn && (
          <>
            <Route path="/dashboard" element={
              <>
                <Navbar onNavigate={navigate} onLogout={handleLogout} isMediator={isMediator} />
                <main className="flex-grow pb-8">
                  <UnifiedDashboardPage
                    sentInterests={sentInterests}
                    setSentInterests={setSentInterests}
                    likedProfiles={likedProfiles}
                    setLikedProfiles={setLikedProfiles}
                    onNavigate={navigate}
                  />
                </main>
                <Footer />
              </>
            } />
            <Route path="/matchlist" element={
              <>
                <Navbar onNavigate={navigate} onLogout={handleLogout} isMediator={isMediator} />
                <main className="flex-grow pb-8">
                  <Matchlist
                    sentInterests={sentInterests}
                    likedProfiles={likedProfiles}
                    onNavigate={() => navigate}
                  />
                </main>
                <Footer />
              </>
            } />
            <Route path="/edit-profile" element={
              <>
                <Navbar onNavigate={navigate} onLogout={handleLogout} isMediator={isMediator} />
                <main className="flex-grow pb-8">
                  {isMediator ? <MediatorProfilePage onProfileComplete={handleMediatorProfileComplete} /> : <EditProfilePage />}
                </main>
                <Footer />
              </>
            } />
            <Route path="/settings" element={
              <>
                <Navbar onNavigate={navigate} onLogout={handleLogout} isMediator={isMediator} />
                <main className="flex-grow pb-8">
                  <SettingsPage />
                </main>
                <Footer />
              </>
            } />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
