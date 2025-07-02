import React, { useState } from 'react';
import './GotraValidation.css';

const GotraValidation = ({ userGotra, profileGotra, onValidMatch }) => {
  const [isSameGotra, setIsSameGotra] = useState(false);

  const validateGotra = () => {
    if (userGotra.toLowerCase() === profileGotra.toLowerCase()) {
      setIsSameGotra(true);
      return false;
    }
    return onValidMatch();
  };

  return (
    <div className="gotra-validation">
      {isSameGotra ? (
        <div className="gotra-error">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
          </svg>
          <h4>Match Restricted</h4>
          <p>According to community guidelines, matches within the same Gotra ({userGotra}) are not permitted.</p>
          <button 
            className="btn btn-secondary"
            onClick={() => setIsSameGotra(false)}
          >
            Understand
          </button>
        </div>
      ) : (
        <button 
          className="btn btn-primary"
          onClick={validateGotra}
        >
          Send Match Request
        </button>
      )}
    </div>
  );
};

export default GotraValidation;