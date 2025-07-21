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

// Add a helper for fuzzy string matching (Levenshtein distance)
function isSimilar(a, b) {
  if (!a || !b) return false;
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return true;
  // Simple Levenshtein distance implementation
  const matrix = Array.from({ length: a.length + 1 }, () => []);
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[a.length][b.length] <= 2; // Allow up to 2 edits
}

const UnifiedDashboardPage = ({ 
  sentInterests, 
  setSentInterests, 
  likedProfiles, 
  setLikedProfiles, 
  directChatProfiles, 
  setDirectChatProfiles, 
  onNavigate,
  likeProfile,
  sendInterest,
  addDirectChatProfile
}) => {
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
    fetch('http://localhost:5000/users/opposite-gender', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
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

    // Age filter
    if (filters.age) {
      newFilteredProfiles = newFilteredProfiles.filter((profile) => {
        const age = profile.age || getAge(profile);
        const [minAge, maxAge] = filters.age.split('-').map(Number);
        if (filters.age === '36+') {
          return age >= 36;
        }
        return age >= minAge && age <= maxAge;
      });
    }

    // State filter
    if (filters.state) {
      newFilteredProfiles = newFilteredProfiles.filter(
        (profile) => isSimilar(profile.state || profile.residingAddress?.state || '', filters.state)
      );
    }

    // City filter
    if (filters.city) {
      newFilteredProfiles = newFilteredProfiles.filter(
        (profile) => isSimilar(profile.city || profile.residingAddress?.city || '', filters.city)
      );
    }

    // Education filter
    if (filters.education) {
      newFilteredProfiles = newFilteredProfiles.filter((profile) => {
        if (Array.isArray(profile.education)) {
          return profile.education.some(
            (edu) =>
              (edu.level && isSimilar(edu.level, filters.education)) ||
              (typeof edu === 'string' && isSimilar(edu, filters.education))
          );
        }
        return isSimilar(profile.education || '', filters.education);
      });
    }

    // Height filter (unchanged)
    if (filters.height) {
      newFilteredProfiles = newFilteredProfiles.filter((profile) => {
        const height = profile.height || '';
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

    // Annual Income filter (unchanged)
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
        (profile) => isSimilar(profile.familyType || '', filters.familyType)
      );
    }

    setFilteredProfiles(newFilteredProfiles);
  };

  const handleViewMore = (profile) => {
    navigate(`/dashboard/profile/${profile._id ? profile._id : profile.id}`);
  };

  const handleSendInterest = async (profile) => {
    setInterestProfile(profile);
    setShowPaymentModal(true);
    // Note: The actual interest sending will happen after payment in PaymentMethods
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setInterestProfile(null);
  };

  const toggleLike = async (profileId) => {
    if (likeProfile) {
      await likeProfile(profileId);
    } else {
      // Fallback to local state update if API function not provided
      setLikedProfiles((prev) =>
        prev.includes(profileId)
          ? prev.filter((id) => id !== profileId)
          : [...prev, profileId]
      );
    }
  };

  // Add a handler for payment selection
  const handleSelectPayment = async (amount, profileId) => {
    if (amount === 199 && sendInterest) {
      // Send interest after payment
      await sendInterest(profileId);
    } else if (amount === 3000 && addDirectChatProfile) {
      // Add to direct chat after payment
      await addDirectChatProfile(profileId);
    }
  };

  useEffect(() => {
    applyFilters(); // Apply filters on initial load and whenever filters change
  }, [filters, allProfiles]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const renderProfileCard = (profile, key) => {
    const profileId = profile._id || profile.id || key;
    const isLiked = likedProfiles.includes(profileId);
    return (
      <div key={key} className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out relative">
        {/* Card content */}
        <div className="flex-grow p-4 flex flex-col">
          {/* Like Icon */}
          <button
            className="absolute top-3 right-3 z-10"
            onClick={() => toggleLike(profileId)}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              size={24}
              className={isLiked ? 'text-red-500 fill-red-500' : 'text-gray-300'}
              fill={isLiked ? 'currentColor' : 'none'}
            />
          </button>
          <div className="relative cursor-pointer mb-4" onClick={() => handleViewMore(profile)}>
            <img className="w-full h-60 object-cover" src={getPhotoUrl(profile.photos && profile.photos[0])} alt={profile.name} />
            {profile.verified && (
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
                Verified
              </div>
            )}
          </div>
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
              <span>{`${profile.city || 'undefined'}, ${profile.state || 'undefined'}`}</span>
            </div>
          </div>
        </div>
        {/* Fixed bottom buttons */}
        <div className="flex justify-between items-center p-4 mt-auto bg-white border-t">
          <button className="flex items-center justify-center w-1/2 mr-2 bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => handleViewMore(profile)}>
            <Eye size={16} className="mr-2" />
            View More
          </button>
          <button className="flex items-center justify-center w-1/2 ml-2 bg-orange-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => handleSendInterest(profile)}>
            <Send size={16} className="mr-2" />
            Send Interest
          </button>
        </div>
      </div>
    );
  };

  const currentUserId = localStorage.getItem('userId');
  console.log('Current userId:', currentUserId);
  // Only show users with a valid _id and not the current user
  const displayProfiles = filteredProfiles.filter(profile => {
    const isCurrent = String(profile._id) === String(currentUserId);
    if (isCurrent) console.log('Filtered out current user:', profile._id);
    return profile._id && !isCurrent;
  });

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
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch" : "flex flex-col gap-4"}>
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
        profileId={interestProfile ? (interestProfile._id || interestProfile.id) : null}
        onSelectPayment={handleSelectPayment}
        hasSentInterest={interestProfile ? sentInterests.includes(interestProfile._id || interestProfile.id) : false}
      />
    </div>
  );
};

export default UnifiedDashboardPage;
