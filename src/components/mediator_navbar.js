import React, { useState } from 'react';

const ManagerNavbar = ({ onProfile, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);

  const openHelpFAQ = (tab) => {
    window.open(`/help-faq?tab=${tab}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center space-x-2">
          <img src="/logo_nobg.png" alt="Viya Logo" className="w-12 h-12" />
          <span className="text-2xl font-bold tracking-tight">Viya Matrimony</span>
        </div>
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4">
          <button onClick={() => onNavigate && onNavigate('dashboard')} className="px-3 py-2 rounded hover:bg-orange-700 font-semibold">Dashboard</button>
          <button onClick={() => onNavigate && onNavigate('match-requests')} className="px-3 py-2 rounded hover:bg-orange-700 font-semibold">Match Requests</button>
          <button onClick={() => onNavigate && onNavigate('assigned-profiles')} className="px-3 py-2 rounded hover:bg-orange-700 font-semibold">Assigned Profiles</button>
          <button onClick={() => onNavigate && onNavigate('commission-tracker')} className="px-3 py-2 rounded hover:bg-orange-700 font-semibold">Commission Tracker</button>
          <button onClick={() => onNavigate && onNavigate('add-user')} className="px-3 py-2 rounded hover:bg-orange-700 font-semibold">Add User</button>
          {/* Profile Icon and Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex items-center space-x-2 hover:text-orange-200 transition-colors focus:outline-none"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => { setIsMenuOpen(false); window.location.href = '/manager-profile-view'; }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); onLogout && onLogout(); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* Help Icon and Dropdown */}
          <div className="relative ml-4">
            <button
              className="bg-transparent border border-black text-black rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
              onClick={() => setIsHelpMenuOpen((v) => !v)}
              aria-label="Help"
            >
              <span className="text-xl font-bold">?</span>
            </button>
            {isHelpMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2">
                <button className="block w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-800" onClick={() => openHelpFAQ('privacy')}>Privacy Policy</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-800" onClick={() => openHelpFAQ('terms')}>Terms of Service</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-800" onClick={() => openHelpFAQ('contact')}>Contact Us</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-800" onClick={() => openHelpFAQ('faq')}>FAQ</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Overlay to close dropdown when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      {isHelpMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsHelpMenuOpen(false)} />
      )}
    </nav>
  );
};

export default ManagerNavbar; 