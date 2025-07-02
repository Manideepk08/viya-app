// src/components/Modal.js
import React from 'react';
import Button from './button.js'; // Import Button for use within Modal

const Modal = ({ title, message, isOpen, onClose, onConfirm, showConfirmButton = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            {showConfirmButton ? 'Cancel' : 'Close'}
          </Button>
          {showConfirmButton && (
            <Button variant="primary" onClick={onConfirm}>
              Confirm
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
