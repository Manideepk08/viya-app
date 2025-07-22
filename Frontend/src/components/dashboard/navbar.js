// src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';

const Navbar = ({ onNavigate, onLogout, isManager, unreadCount, notifications = [], onNotificationClick, onAcceptInterest, onRejectInterest }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef();
  // Mock notifications
  // const [notifications, setNotifications] = useState([]); // This line is now redundant as unreadCount is passed as a prop

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  // Listen for new chat messages via props or socket (if needed)
  useEffect(() => {
    // This effect should be updated to receive new notifications from props or socket
    // For now, just keep notifications in state
  }, []);

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
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button className="relative" onClick={() => setIsNotifOpen((v) => !v)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">{unreadCount}</span>
              )}
            </button>
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                <div className="p-3 border-b font-semibold text-gray-700">Notifications</div>
                <ul className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <li className="p-4 text-gray-400 text-center">No new notifications</li>
                  ) : notifications.map((notif, idx) => (
                    <li key={notif._id || idx} className="px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-orange-100 flex flex-col gap-2">
                      <div className="flex items-center gap-2" onClick={() => { console.log('Notification clicked:', notif); onNotificationClick && onNotificationClick(notif); }}>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-800">{notif.title}</div>
                          <div className="text-xs text-gray-500 truncate">{notif.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}</div>
                        </div>
                      </div>
                      {/* Accept/Reject for interest notifications */}
                      {notif.title === 'New Interest Received' && notif.interestId && (
                        <div className="flex gap-2 mt-1">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold"
                            disabled={notif.loadingAccept}
                            onClick={e => { e.stopPropagation(); onAcceptInterest && onAcceptInterest(notif); }}
                          >{notif.loadingAccept ? 'Accepting...' : 'Accept'}</button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold"
                            disabled={notif.loadingReject}
                            onClick={e => { e.stopPropagation(); onRejectInterest && onRejectInterest(notif); }}
                          >{notif.loadingReject ? 'Rejecting...' : 'Reject'}</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
