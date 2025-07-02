// src/pages/SettingsPage.js
import React, { useState } from 'react';
import Button from '../../components/dashboard/button.js'; // Fixed path
import Modal from '../../components/dashboard/modal.js';   // Fixed path

const SettingsPage = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
    // In a real app, update this setting in the backend
    console.log('Privacy toggled:', !isPrivate);
  };

  const handleDeleteProfile = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProfile = () => {
    // In a real app, send a delete request to the backend
    console.log('Profile deleted!');
    setIsDeleteModalOpen(false);
    setIsSuccessModalOpen(true); // Show success message
    // Potentially redirect user or log them out after deletion
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Account Settings</h2>

      <div className="space-y-6">
        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
          <label htmlFor="privacy-toggle" className="text-lg font-medium text-gray-800">
            Profile Privacy
            <p className="text-sm text-gray-600 mt-1">
              {isPrivate ? 'Your profile is currently private. Only visible to your connections.' : 'Your profile is currently public. Visible to all relevant matches.'}
            </p>
          </label>
          <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isPrivate ? 'bg-indigo-600' : 'bg-gray-200'}`}>
            <input
              type="checkbox"
              id="privacy-toggle"
              className="sr-only"
              checked={isPrivate}
              onChange={togglePrivacy}
            />
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`}
            ></span>
          </div>
        </div>

        {/* Delete Profile */}
        <div className="p-4 bg-red-50 rounded-md shadow-sm border border-red-200">
          <h3 className="text-lg font-medium text-red-800 mb-2">Delete Profile</h3>
          <p className="text-sm text-red-700 mb-4">
            Permanently delete your Viya account and all associated data. This action cannot be undone.
          </p>
          <Button variant="danger" onClick={handleDeleteProfile}>
            Delete My Account
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Account Deletion"
        message="Are you sure you want to delete your account? This action is irreversible."
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={confirmDeleteProfile}
        showConfirmButton={true}
      />

      {/* Success Modal (after deletion) */}
      <Modal
        title="Profile Deleted"
        message="Your profile has been successfully deleted. We're sorry to see you go!"
        isOpen={isSuccessModalOpen}
        onClose={closeModal}
        showConfirmButton={false} // No confirm button for a success message
      />
    </div>
  );
};

export default SettingsPage;
