import React from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => (
  <nav className="bg-orange-500 shadow-lg">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">Viya Matrimony</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate('match-list')}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Matches
          </button>
          <button 
            onClick={() => onNavigate('edit-profile')}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Profile
          </button>
          <button 
            onClick={() => onNavigate('settings')}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar; 