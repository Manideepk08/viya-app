// src/components/ProfileDetailsModal.js
import React, { useState } from 'react';
import Button from './button.js'; // Import Button for use within Modal
import Modal from './modal.js'; // Import Modal for the nested confirmation
import PaymentModal from '../../pages/payments-FAQ/PaymentModal.js';

const ProfileDetailsModal = ({ profile, isOpen, onClose }) => {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!isOpen || !profile) return null;

  const media = [
    ...(profile.photos || []),
    ...(profile.video ? [profile.video] : [])
  ];
  const isVideo = (url) => url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));

  const handlePrev = () => setMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  const handleNext = () => setMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));

  const handleInterestedClick = () => setShowPaymentModal(true);
  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    onClose();
  };

  // Helper for displaying a field
  const Field = ({ label, value }) => (
    <div className="flex items-center mb-2">
      <span className="font-semibold text-gray-800 mr-1">{label}:</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );

  // Helper for displaying a list of fields
  const FieldList = ({ label, items, renderItem }) => (
    <div className="mb-2">
      <span className="font-semibold text-gray-800 mr-1">{label}:</span>
      <span className="text-gray-700">{items && items.length > 0 ? items.map(renderItem) : 'N/A'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 overflow-y-auto">
      <div className="bg-[#fffaf5] w-full h-full p-0 m-0 relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-8 text-gray-600 hover:text-gray-900 text-3xl font-bold z-50"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Media Gallery (1/3) */}
          <div className="flex flex-col items-center justify-center md:w-1/3 w-full bg-white p-8 rounded-none relative">
            {media.length > 0 ? (
              <>
                <div className="relative w-full flex flex-col items-center">
                  {isVideo(media[mediaIndex]) ? (
                    <video
                      src={media[mediaIndex]}
                      controls
                      className="w-72 h-72 rounded-2xl object-cover border-4 border-orange-200 shadow-lg bg-black"
                    />
                  ) : (
                    <img
                      src={media[mediaIndex]}
                      alt={`Profile media ${mediaIndex + 1}`}
                      className="w-72 h-72 rounded-2xl object-cover border-4 border-orange-200 shadow-lg"
                      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x300/9CA3AF/ffffff?text=N/A'; }}
                    />
                  )}
                  {media.length > 1 && (
                    <>
                      <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">&#8592;</button>
                      <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">&#8594;</button>
                    </>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  {media.map((m, idx) => (
                    <button
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 ${idx === mediaIndex ? 'bg-orange-500 border-orange-700' : 'bg-gray-200 border-gray-400'}`}
                      onClick={() => setMediaIndex(idx)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-72 h-72 flex items-center justify-center bg-gray-100 rounded-2xl border-4 border-orange-200 shadow-lg text-gray-400">No Media</div>
            )}
          </div>
          {/* Profile Details (2/3) */}
          <div className="flex-1 flex flex-col justify-start p-10 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{profile.firstName || profile.name} {profile.lastName || ''}</h2>
              {profile.verified && (
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-base font-semibold flex items-center"><svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Verified</span>
              )}
            </div>
            <div className="text-2xl text-orange-500 font-semibold mb-4">{profile.age} years old</div>
            {/* Basic Personal Details */}
            <div className="bg-orange-50 rounded-xl p-5 mb-6 shadow-sm">
              <h4 className="text-lg font-bold text-orange-700 mb-3 border-b border-orange-200 pb-1">Basic Personal Details</h4>
              <Field label="Gender" value={profile.gender || 'N/A'} />
              <Field label="Date of Birth" value={profile.dob || 'N/A'} />
              <Field label="Marital Status" value={profile.maritalStatus || 'N/A'} />
              <Field label="Height" value={profile.height || 'N/A'} />
              <Field label="Weight" value={profile.weight || 'N/A'} />
              <Field label="Blood Group" value={profile.bloodGroup || 'N/A'} />
              <Field label="Residing City" value={profile.residingAddress && profile.residingAddress.city ? profile.residingAddress.city : 'N/A'} />
              <Field label="Residing State" value={profile.residingAddress && profile.residingAddress.state ? profile.residingAddress.state : 'N/A'} />
            </div>
            {/* About Me */}
            <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
              <h4 className="text-lg font-bold text-orange-700 mb-3 border-b border-orange-200 pb-1">About Me</h4>
              <p className="text-gray-700">{profile.aboutMe || profile.bio || 'No description provided.'}</p>
            </div>
            {/* Education and Occupation */}
            <div className="bg-orange-50 rounded-xl p-5 mb-6 shadow-sm">
              <h4 className="text-lg font-bold text-orange-700 mb-3 border-b border-orange-200 pb-1">Education and Occupation</h4>
              {Array.isArray(profile.education) ? (
                <ul className="list-disc ml-6 mb-2">
                  {profile.education.map((edu, idx) => (
                    <li key={idx}>{[edu.level, edu.stream, edu.institute].filter(Boolean).join(', ')}</li>
                  ))}
                </ul>
              ) : (
                <Field label="Education" value={profile.education || 'N/A'} />
              )}
              <Field label="Employee Role" value={profile.employeeRole || profile.job || 'N/A'} />
              <Field label="Company" value={profile.company || 'N/A'} />
              <Field label="Annual Salary" value={profile.annualSalary || 'N/A'} />
              <Field label="Work Location" value={profile.workLocation ? `${profile.workLocation.city}, ${profile.workLocation.state}, ${profile.workLocation.country}` : (profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'N/A')} />
            </div>
            {/* Family Details */}
            <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
              <h4 className="text-lg font-bold text-orange-700 mb-3 border-b border-orange-200 pb-1">Family Details</h4>
              <Field label="Family Type" value={profile.familyType || 'N/A'} />
              <Field label="Family Status" value={profile.familyStatus || 'N/A'} />
              <Field label="Father's Name" value={profile.fatherName || 'N/A'} />
              <Field label="Father's Occupation" value={profile.fatherOccupation || 'N/A'} />
              <Field label="Mother's Name" value={profile.motherName || 'N/A'} />
              <Field label="Mother's Occupation" value={profile.motherOccupation || 'N/A'} />
              <Field label="Parents Together" value={profile.parentsTogether === false ? 'No' : 'Yes'} />
              <FieldList label="Siblings" items={profile.siblings || []} renderItem={(sib, i) => <span key={i}>{sib.relation} {sib.gender} - {sib.occupation}; </span>} />
            </div>
            {/* Cultural and Religion */}
            <div className="bg-orange-50 rounded-xl p-5 mb-6 shadow-sm">
              <h4 className="text-lg font-bold text-orange-700 mb-3 border-b border-orange-200 pb-1">Cultural and Religion</h4>
              <Field label="Religion" value={profile.religion || 'N/A'} />
              <Field label="Community" value={profile.community || 'N/A'} />
              <Field label="Gothram" value={profile.gothram || 'N/A'} />
              <Field label="Mother Tongue" value={profile.motherTongue || 'N/A'} />
              <Field label="Zodiac Sign" value={profile.zodiacSign || 'N/A'} />
            </div>
            {/* Lifestyle, Habits, Health */}
            <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
              <h4 className="text-lg font-bold text-orange-700 mb-3 border-b border-orange-200 pb-1">Lifestyle, Habits, and Health</h4>
              <Field label="Dietary Habits" value={profile.dietaryHabits || 'N/A'} />
              <Field label="Smoking" value={profile.smoking || 'N/A'} />
              <Field label="Drinking" value={profile.drinking || 'N/A'} />
              <Field label="Hobbies and Interests" value={profile.hobbies || 'N/A'} />
              <Field label="Physical Disabilities" value={profile.disabilities || 'None'} />
              <Field label="Medical Conditions" value={profile.medicalConditions || 'None'} />
            </div>
            <div className="mt-8 flex flex-col items-start">
              <Button onClick={handleInterestedClick} className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600">Send Interest</Button>
              <span className="text-gray-500 text-xs mt-2">One-time payment to express interest</span>
            </div>
          </div>
        </div>
        {/* Payment Modal Overlay */}
        <PaymentModal show={showPaymentModal} onClose={handlePaymentClose} amount={199} />
      </div>
    </div>
  );
};

export default ProfileDetailsModal;
