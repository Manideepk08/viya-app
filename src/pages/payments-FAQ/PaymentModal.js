import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentModal.css';

const mediatorFeatures = [
  { text: 'Initiates communication through a mediator', check: true },
  { text: 'Ensures user privacy', check: true },
  { text: 'Amount auto-deducted upon request', check: true },
  { text: 'Affordable for limited budget', check: true },
  { text: 'Simple, guided process', check: true },
  { text: 'Mediator facilitates initial conversations', check: true },
  { text: 'Direct contact', check: false },
  { text: 'Premium features', check: false },
];

const directFeatures = [
  { text: 'Direct contact on mutual interest', check: true },
  { text: 'Instant, direct engagement', check: true },
  { text: 'Premium option', check: true },
  { text: 'Amount charged after acceptance', check: true },
  { text: 'Requires proactive engagement', check: true },
  { text: 'Best for quick responses', check: true },
  { text: 'Privacy via mediator', check: false },
  { text: 'Budget-friendly', check: false },
];

const PaymentModal = ({ show, onClose, profileId, onSelectPayment }) => {
  const navigate = useNavigate();
  if (!show) return null;

  // On select, call onSelectPayment and navigate to payment methods page with amount and profileId
  const handleSelect = (amount) => {
    if (onSelectPayment) {
      onSelectPayment(amount, profileId);
    }
    onClose();
    navigate('/payment-methods', { state: { amount, profileId } });
  };

  // Close modal if overlay is clicked
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('payment-modal-overlay')) {
      onClose();
    }
  };

  const renderFeatures = (features) => (
    <ul className="feature-list">
      {features.map((f, i) => (
        <li key={i} className={f.check ? 'feature-check' : 'feature-cross'}>
          {f.check ? (
            <span className="icon-check">✔</span>
          ) : (
            <span className="icon-cross">✖</span>
          )}
          {f.text}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="payment-modal-overlay" onClick={handleOverlayClick}>
      <div className="payment-modal card-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="card-modal-title">Choose your connection method</div>
        <div className="card-options-row">
          <div className="payment-card mediator-card">
            <div className="card-ribbon mediator-ribbon">₹199</div>
            <div className="card-title mediator-title">Mediator</div>
            {renderFeatures(mediatorFeatures)}
            <button
              className="card-select-btn mediator-btn"
              onClick={() => handleSelect(199)}
            >
              SELECT
            </button>
          </div>
          <div className="payment-card direct-card">
            <div className="card-ribbon direct-ribbon">₹3,000</div>
            <div className="card-title direct-title">Direct Chat</div>
            {renderFeatures(directFeatures)}
            <button
              className="card-select-btn direct-btn"
              onClick={() => handleSelect(3000)}
            >
              SELECT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;