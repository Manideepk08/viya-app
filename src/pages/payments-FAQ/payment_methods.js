import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentMethods = () => {
  const [selected, setSelected] = useState(null); // 'upi', 'credit', 'debit'
  const location = useLocation();
  const amount = location.state?.amount;
  const profileId = location.state?.profileId;
  const navigate = useNavigate();

  // Generate QR code URL with amount for UPI
  const qrAmount = amount ? String(amount) : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=example@upi&pn=ViyaApp&am=${qrAmount}`;

  const handlePaymentSuccess = () => {
    // If direct chat payment, store profileId in localStorage
    if (amount === 3000 && profileId) {
      let directChatProfiles = JSON.parse(localStorage.getItem('directChatProfiles') || '[]');
      if (!directChatProfiles.includes(profileId)) {
        directChatProfiles.push(profileId);
        localStorage.setItem('directChatProfiles', JSON.stringify(directChatProfiles));
      }
    }
    // Get mediator details from localStorage
    const mediatorProfile = JSON.parse(localStorage.getItem('mediatorProfile')) || {
      name: 'Your Assigned Mediator',
      email: 'mediator@viya.com',
      phone: 'N/A',
      location: 'N/A',
      experience: 'N/A',
      specialization: 'N/A',
      about: '',
    };
    navigate('/mediator-assigned', { state: { mediator: mediatorProfile } });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdeeee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, minWidth: 340, maxWidth: 500, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Payment method selection row */}
        {!selected && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, justifyContent: 'center', marginBottom: 8 }}>
            <button style={{ flex: 1, padding: 18, borderRadius: 10, fontSize: 18, fontWeight: 600, background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setSelected('upi')}>UPI</button>
            <button style={{ flex: 1, padding: 18, borderRadius: 10, fontSize: 18, fontWeight: 600, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setSelected('credit')}>Credit Card</button>
            <button style={{ flex: 1, padding: 18, borderRadius: 10, fontSize: 18, fontWeight: 600, background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setSelected('debit')}>Debit Card</button>
          </div>
        )}
        {/* UPI Form */}
        {selected === 'upi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#f97316', marginBottom: 8 }}>Pay Amount: ₹{amount || '...'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <input type="text" placeholder="Enter your UPI ID" style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
              <img src={qrUrl} alt="UPI QR" style={{ width: 140, height: 140, borderRadius: 8, border: '1px solid #eee' }} />
            </div>
            <button style={{ padding: 14, borderRadius: 8, background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', marginTop: 12 }} onClick={handlePaymentSuccess}>Pay Now</button>
          </div>
        )}
        {/* Credit Card Form */}
        {selected === 'credit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>Pay Amount: ₹{amount || '...'}</div>
            <input type="text" placeholder="Card Holder Name" style={{ padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
            <input type="text" placeholder="Card Number" style={{ padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder="MM/YY" style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
              <input type="text" placeholder="CVC" style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
            </div>
            <button style={{ padding: 14, borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', marginTop: 12 }} onClick={handlePaymentSuccess}>Pay Now</button>
          </div>
        )}
        {/* Debit Card Form */}
        {selected === 'debit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>Pay Amount: ₹{amount || '...'}</div>
            <input type="text" placeholder="Card Holder Name" style={{ padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
            <input type="text" placeholder="Card Number" style={{ padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder="MM/YY" style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
              <input type="text" placeholder="CVC" style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
            </div>
            <button style={{ padding: 14, borderRadius: 8, background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', marginTop: 12 }} onClick={handlePaymentSuccess}>Pay Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods; 