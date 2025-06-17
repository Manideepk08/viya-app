// src/components/Navbar.js
import React from 'react';

const Navbar = ({ onNavigate, onLogout, isMediator = false }) => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Heart icon for Viya logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-red-300"
          >
            <path d="m11.645 20.917-7.393-7.393a12.004 12.004 0 0 0 6.59-4.887c.945-1.719 2.25-3.607 2.25-3.607s1.305 1.888 2.25 3.607a12.004 12.004 0 0 0 6.59 4.887l-7.393 7.393c-.134.134-.305.24-.486.334a7.994 7.994 0 0 1-.362.175l-.016.007a.666.666 0 0 1-.104.053.864.864 0 0 1-.096.04c-.033.017-.066.035-.1.05-.03.012-.059.026-.089.039a2.702 2.702 0 0 1-.365.115 2.802 2.802 0 0 1-.314.04h-.002c-.09-.001-.18-.008-.27-.019-.088-.01-.177-.02-.265-.036a2.999 2.999 0 0 1-.168-.073 2.592 2.592 0 0 1-.14-.063c-.031-.015-.062-.03-.093-.048a.665.665 0 0 1-.1-.065c-.06-.035-.12-.074-.179-.118a1.282 1.282 0 0 1-.167-.145 12.004 12.004 0 0 0-.475-.356l-.282-.203Z" />
          </svg>
          <span className="text-2xl font-bold tracking-tight">Viya</span>
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          {!isMediator && (
            <>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-purple-200 transition-colors">Dashboard</button>
              <button onClick={() => onNavigate('edit-profile')} className="hover:text-purple-200 transition-colors">Edit Profile</button>
              <button onClick={() => onNavigate('match-list')} className="hover:text-purple-200 transition-colors">Match List</button>
              <button onClick={() => onNavigate('settings')} className="hover:text-purple-200 transition-colors">Settings</button>
            </>
          )}
          {isMediator && (
            <>
              <button onClick={() => onNavigate('mediator')} className="hover:text-purple-200 transition-colors">Dashboard</button>
              <button onClick={() => onNavigate('mediator-profile')} className="hover:text-purple-200 transition-colors">Profile</button>
            </>
          )}
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
