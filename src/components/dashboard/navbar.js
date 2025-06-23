// src/components/Navbar.js
import React, { useState } from 'react';

const Navbar = ({ onNavigate, onLogout, isManager = false }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const openHelpFAQ = (tab) => {
    window.open(`/help-faq?tab=${tab}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('/dashboard')}>
          <img src="/logo_nobg.png" alt="Viya Logo" className="w-14 h-14" />
          <span className="text-2xl font-bold tracking-tight">Viya Matrimony</span>
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          {/* Profile Menu Dropdown */}
          <div className="relative">
            <button 
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 hover:text-purple-200 transition-colors focus:outline-none"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
            
            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {/* My Interests Dropdown */}
                <button
                  onClick={() => {
                    onNavigate('/matchlist');
                    setIsProfileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100 font-semibold border-b border-gray-200"
                >
                  My Interests
                </button>
                {!isManager && (
                  <>
                    <button 
                      onClick={() => {
                        onNavigate('/edit-profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate('/settings');
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </button>
                  </>
                )}
                {isManager && (
                  <button 
                    onClick={() => {
                      onNavigate('/manager');
                      setIsProfileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                )}
                <button 
                  onClick={() => {
                    onLogout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* Help Menu Dropdown */}
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
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
      {isHelpMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsHelpMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
