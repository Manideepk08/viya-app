// src/pages/Dashboard/UnifiedDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Heart, Send, Eye, Book, MapPin, Briefcase } from 'react-feather';
import ProfileDetailsModal from '../../components/dashboard/ProfileDetailsModal';
import Filters from '../../components/dashboard/Filters';
import Button from '../../components/dashboard/button';
import PaymentModal from '../payments-FAQ/PaymentModal';
import Matchlist from './Matchlist';
import { useNavigate } from 'react-router-dom';

const getPhotoUrl = (photo) => {
  if (!photo) return '/default-profile.png';
  return photo.startsWith('/uploads') ? `http://localhost:5000${photo}` : photo;
};

const getAge = (profile) => {
  if (profile.age) return profile.age;
  if (profile.dob) {
    const dob = new Date(profile.dob);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }
  return '';
};

const UnifiedDashboardPage = ({ sentInterests, setSentInterests, likedProfiles, setLikedProfiles, directChatProfiles, setDirectChatProfiles, onNavigate }) => {
  const [filters, setFilters] = useState({
    age: '',
    state: '',
    city: '',
    education: '',
    height: '',
    annualIncome: '',
    familyType: '',
  });
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [interestProfile, setInterestProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = {
    gotra: 'Shandilya',
  };

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/users')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setAllProfiles(data);
        setFilteredProfiles(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch profiles');
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = () => {
    let newFilteredProfiles = allProfiles;

    if (filters.age) {
      newFilteredProfiles = newFilteredProfiles.filter((profile) => {
        const [minAge, maxAge] = filters.age.split('-').map(Number);
        if (filters.age === '36+') {
          return profile.age >= 36;
        }
        return profile.age >= minAge && profile.age <= maxAge;
      });
    }

    if (filters.state) {
      newFilteredProfiles = newFilteredProfiles.filter(
        (profile) => profile.state === filters.state
      );
    }

    if (filters.city) {
      newFilteredProfiles = newFilteredProfiles.filter(
        (profile) => profile.city === filters.city
      );
    }

    if (filters.education) {
      newFilteredProfiles = newFilteredProfiles.filter(
        (profile) => profile.education === filters.education
      );
    }

    // Height filter
    if (filters.height) {
      newFilteredProfiles = newFilteredProfiles.filter((profile) => {
        const height = profile.height || '';
        // Normalize height string for comparison
        const heightInInches = (() => {
          const match = height.match(/(\d+)'(\d+)?/);
          if (!match) return 0;
          const feet = parseInt(match[1], 10);
          const inches = match[2] ? parseInt(match[2], 10) : 0;
          return feet * 12 + inches;
        })();
        switch (filters.height) {
          case 'below-5ft':
            return heightInInches < 60;
          case '5ft-5ft5in':
            return heightInInches >= 60 && heightInInches <= 65;
          case '5ft6in-6ft':
            return heightInInches >= 66 && heightInInches <= 72;
          case 'above-6ft':
            return heightInInches > 72;
          default:
            return true;
        }
      });
    }

    // Annual Income filter
    if (filters.annualIncome) {
      newFilteredProfiles = newFilteredProfiles.filter((profile) => {
        const income = parseInt(profile.annualSalary || '0', 10);
        switch (filters.annualIncome) {
          case 'below-2L':
            return income < 200000;
          case '2L-5L':
            return income >= 200000 && income <= 500000;
          case '5L-10L':
            return income > 500000 && income <= 1000000;
          case '10L+':
            return income > 1000000;
          default:
            return true;
        }
      });
    }

    // Family Type filter
    if (filters.familyType) {
      newFilteredProfiles = newFilteredProfiles.filter(
        (profile) => (profile.familyType || '').toLowerCase() === filters.familyType
      );
    }

    setFilteredProfiles(newFilteredProfiles);
  };

  const handleViewMore = (profile) => {
    navigate(`/dashboard/profile/${profile._id ? profile._id : profile.id}`);
  };

  const handleSendInterest = (profile) => {
    setInterestProfile(profile);
    setShowPaymentModal(true);
    setSentInterests((prev) => prev.includes(profile.id) ? prev : [...prev, profile.id]);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setInterestProfile(null);
  };

  const toggleLike = (profileId) => {
    setLikedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  // Add a handler for payment selection
  const handleSelectPayment = (amount, profileId) => {
    // Store the payment intent in state if needed
    // We'll handle adding to directChatProfiles after payment success in PaymentMethods
    // Optionally, you could set a flag here
  };

  useEffect(() => {
    applyFilters(); // Apply filters on initial load and whenever filters change
  }, [filters, allProfiles]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const renderProfileCard = (profile, key) => {
    const isLiked = likedProfiles.includes(profile.id);
    if (viewMode === 'list') {
      return (
        <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 ease-in-out relative">
          {/* Like Icon */}
          <button
            className="absolute top-3 right-3 z-10"
            onClick={() => toggleLike(profile.id)}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              size={24}
              className={isLiked ? 'text-red-500 fill-red-500' : 'text-gray-300'}
              fill={isLiked ? 'currentColor' : 'none'}
            />
          </button>
          <div className="flex items-center p-4">
            <div className="relative mr-4 cursor-pointer" onClick={() => handleViewMore(profile)}>
              <img 
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200" 
                src={getPhotoUrl(profile.photos[0])} 
                alt={profile.name} 
              />
              {profile.verified && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full px-1 py-0.5 text-xs font-semibold">
                  ✓
                </div>
              )}
            </div>
            <div className="flex-grow cursor-pointer" onClick={() => handleViewMore(profile)}>
              <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
              <p className="text-md text-orange-500 font-semibold">{getAge(profile)} years old</p>
              
              <div className="mt-2 space-y-1 text-gray-700 text-sm">
                <div className="flex items-center">
                  <Book size={14} className="mr-2 text-gray-500" />
                  <span>{Array.isArray(profile.education) ? profile.education.map((edu) => [edu.level, edu.stream, edu.institute].filter(Boolean).join(' ')).join(', ') : (profile.education || '')}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase size={14} className="mr-2 text-gray-500" />
                  <span>{profile.job}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2 text-gray-500" />
                  <span>{`${profile.city}, ${profile.state}`}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => handleViewMore(profile)}
              >
                <Eye size={14} className="mr-1" />
                View
              </button>
              {currentUser.gotra === profile.gotra ? (
                <div>
                  <button 
                    disabled 
                    className="flex items-center justify-center bg-gray-200 text-gray-400 rounded-lg px-3 py-2 text-sm font-medium cursor-not-allowed"
                  >
                    <Heart size={14} className="mr-1" />
                    Same Gotra
                  </button>
                  <p className="text-red-500 text-xs mt-1 w-24">Same Gothram</p>
                </div>
              ) : (
                <button className="flex items-center justify-center bg-orange-500 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" onClick={() => handleSendInterest(profile)}>
                  <Send size={14} className="mr-1" />
                  Interest
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Grid view (original dashboard style)
    return (
      <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out relative">
        {/* Like Icon */}
        <button
          className="absolute top-3 right-3 z-10"
          onClick={() => toggleLike(profile.id)}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart
            size={24}
            className={isLiked ? 'text-red-500 fill-red-500' : 'text-gray-300'}
            fill={isLiked ? 'currentColor' : 'none'}
          />
        </button>
        <div className="relative cursor-pointer" onClick={() => handleViewMore(profile)}>
          <img className="w-full h-60 object-cover" src={getPhotoUrl(profile.photos[0])} alt={profile.name} />
          {profile.verified && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
              Verified
            </div>
          )}
        </div>
        <div className="p-4 cursor-pointer" onClick={() => handleViewMore(profile)}>
          <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
          <p className="text-md text-orange-500 font-semibold">{getAge(profile)} years old</p>
          
          <div className="mt-4 space-y-2 text-gray-700">
            <div className="flex items-center">
              <Book size={16} className="mr-2 text-gray-500" />
              <span>{Array.isArray(profile.education) ? profile.education.map((edu) => [edu.level, edu.stream, edu.institute].filter(Boolean).join(' ')).join(', ') : (profile.education || '')}</span>
            </div>
            <div className="flex items-center">
              <Briefcase size={16} className="mr-2 text-gray-500" />
              <span>{profile.job}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-gray-500" />
              <span>{`${profile.city}, ${profile.state}`}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => handleViewMore(profile)}
            >
              <Eye size={16} className="mr-2" />
              View More
            </button>
            {currentUser.gotra === profile.gotra ? (
              <div>
                <button 
                  disabled 
                  className="flex items-center justify-center w-full bg-gray-200 text-gray-400 rounded-lg px-4 py-2 text-sm font-medium cursor-not-allowed"
                >
                  <Heart size={16} className="mr-2" />
                  Same Gotra
                </button>
                <p className="text-red-500 text-xs mt-1">You both belong to the same Gothram. Match not allowed by community rules.</p>
              </div>
            ) : (
              <button className="flex items-center justify-center w-full bg-orange-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" onClick={() => handleSendInterest(profile)}>
                <Send size={16} className="mr-2" />
                Send Interest
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const currentUserId = localStorage.getItem('userId');
  // Only show users with a valid _id
  const displayProfiles = filteredProfiles.filter(profile => profile._id);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Match with Magic</h2>
        
        {/* Filters Section */}
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={applyFilters}
        />

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            aria-label="Grid View"
            className={`p-2 rounded-full border-2 ${viewMode === 'grid' ? 'bg-orange-500 border-orange-700 text-white' : 'bg-white border-gray-300 text-gray-500'} hover:bg-orange-100 transition`}
            onClick={() => setViewMode('grid')}
          >
            {/* Grid icon: 4 squares */}
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="2"/>
              <rect x="14" y="3" width="7" height="7" rx="2"/>
              <rect x="14" y="14" width="7" height="7" rx="2"/>
              <rect x="3" y="14" width="7" height="7" rx="2"/>
            </svg>
          </button>
          <button
            aria-label="List View"
            className={`p-2 rounded-full border-2 ${viewMode === 'list' ? 'bg-orange-500 border-orange-700 text-white' : 'bg-white border-gray-300 text-gray-500'} hover:bg-orange-100 transition`}
            onClick={() => setViewMode('list')}
          >
            {/* List icon: 3 horizontal lines */}
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-center">
          <p className="text-gray-600">
            Showing {displayProfiles.length} of {allProfiles.length} profiles
          </p>
        </div>

        {/* Profile Cards */}
        {displayProfiles.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
            {displayProfiles.map((profile, idx) => renderProfileCard(profile, profile._id || profile.id || idx))}
          </div>
        ) : (
          <div className="text-center text-gray-600 p-10 bg-white rounded-lg shadow-md">
            <p className="text-lg font-medium">No matches found with the current filters.</p>
            <p className="text-sm mt-2">Try adjusting your filter selections.</p>
          </div>
        )}
      </div>

      <ProfileDetailsModal
        profile={null} // No longer needed as modal is route-based
        isOpen={false} // No longer needed as modal is route-based
        onClose={() => {}} // No longer needed as modal is route-based
      />
      <PaymentModal
        show={showPaymentModal}
        onClose={handlePaymentClose}
        profileId={interestProfile ? interestProfile.id : null}
        onSelectPayment={handleSelectPayment}
      />
    </div>
  );
};

export default UnifiedDashboardPage;
