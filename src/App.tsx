import React, { useState } from 'react';
import './App.css';
import IntroProfileApp from './pages/intro+profile/intro_profile';
import Navbar from './components/dashboard/navbar';
import Footer from './components/dashboard/footer';
import DashboardPage from './pages/Dashboard/DashboardPage';
import MatchListPage from './pages/Dashboard/MatchListPage';
import EditProfilePage from './pages/Dashboard/EditProfilePage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import MediatorDashboard from './pages/Mediator/mediator_page';
import MediatorProfilePage from './pages/Mediator/MediatorProfilePage';

function App() {
  const [currentPage, setCurrentPage] = useState('intro');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMediator, setIsMediator] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLoginSuccess = (mediatorStatus: boolean) => {
    setIsMediator(mediatorStatus);
    // Don't set as logged in yet - show profile creation first
    setShowProfile(true);
  };

  const handleProfileComplete = () => {
    // Now set as logged in and go to appropriate dashboard
    setIsLoggedIn(true);
    if (isMediator) {
      setCurrentPage('mediator');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('intro');
    setIsMediator(false);
    setShowProfile(false);
  };

  // If not logged in and not showing profile, show intro/login page
  if (!isLoggedIn && !showProfile) {
    return <IntroProfileApp onProfileComplete={handleLoginSuccess} isMediator={false} />;
  }

  // If showing profile creation (either mediator or regular user)
  if (showProfile && !isLoggedIn) {
    return <IntroProfileApp onProfileComplete={handleProfileComplete} isMediator={isMediator} />;
  }

  // If logged in as mediator, show only mediator dashboard
  if (isLoggedIn && isMediator) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-amber-50 antialiased">
        <Navbar onNavigate={setCurrentPage} onLogout={handleLogout} isMediator={true} />
        <main className="flex-grow pb-8">
          {currentPage === 'mediator' && <MediatorDashboard />}
          {currentPage === 'mediator-profile' && <MediatorProfilePage />}
        </main>
        <Footer />
      </div>
    );
  }

  // If logged in as regular user, show the main app with navigation
  return (
    <div className="min-h-screen flex flex-col font-sans bg-amber-50 antialiased">
      <Navbar onNavigate={setCurrentPage} onLogout={handleLogout} isMediator={false} />

      <main className="flex-grow pb-8">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'edit-profile' && <EditProfilePage />}
        {currentPage === 'match-list' && <MatchListPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
