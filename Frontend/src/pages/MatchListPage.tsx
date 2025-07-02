import React from 'react';

const MatchListPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Matches</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Match List</h2>
        <p className="text-gray-600">View and manage your matches here.</p>
      </div>
    </div>
  </div>
);

export default MatchListPage; 