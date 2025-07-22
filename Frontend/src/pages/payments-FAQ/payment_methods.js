import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentMethods = () => {
  const [selected, setSelected] = useState(null); // 'upi', 'credit', 'debit'
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const amount = location.state?.amount;
  const profileId = location.state?.profileId;
  const navigate = useNavigate();
  const hasSentInterest = location.state?.hasSentInterest;

  // Generate QR code URL with amount for UPI
  const qrAmount = amount ? String(amount) : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=example@upi&pn=ViyaApp&am=${qrAmount}`;

  const handlePaymentSuccess = async () => {
    const token = localStorage.getItem('token');
    let success = true;
    let errorMessage = '';
    
    try {
      if (amount === 199 && profileId && !hasSentInterest) {
        // Only add to sentInterests for 199 payment if not already sent
        const res = await fetch(`http://localhost:5000/users/interests/${profileId}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentAmount: 199 })
        });
        
        if (!res.ok) {
          const data = await res.json();
          errorMessage = data.msg || 'Failed to send interest';
          success = false;
          console.error('Interest error:', data);
        }
      }
      
      if (amount === 3000 && profileId) {
        // Try direct chat first
        const res1 = await fetch(`http://localhost:5000/users/direct-chat/${profileId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount: 3000 })
        });
        
        const data1 = await res1.json();
        if (!res1.ok) {
          errorMessage = data1.msg || 'Failed to enable direct chat';
          success = false;
          console.error('Direct chat error:', data1);
        }

        // Only add to sentInterests if not already sent
        if (!hasSentInterest) {
          const res2 = await fetch(`http://localhost:5000/users/interests/${profileId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentAmount: 3000 })
          });
          
          if (!res2.ok) {
            const data2 = await res2.json();
            if (errorMessage) errorMessage += ' and ';
            errorMessage += data2.msg || 'Failed to send interest';
            success = false;
            console.error('Interest error:', data2);
          }
        }
      }
    } catch (err) {
      success = false;
      errorMessage = 'An unexpected error occurred';
      console.error('Payment error:', err);
    }
    if (success) {
      setPaymentSuccess(true);
      setError('');
    } else {
      setError(errorMessage || 'There was a problem processing your payment. Please try again.');
    }
  };

  // Redirect to dashboard after payment success
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        window.location.href = '/dashboard'; // Hard reload to ensure fresh state
      }, 2000); // 2 seconds
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

  return (
    <div style={{ minHeight: '100vh', background: '#fdeeee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, minWidth: 340, maxWidth: 500, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {error && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#fee2e2', 
            color: '#ef4444', 
            borderRadius: '8px',
            marginBottom: '12px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        {/* Payment method selection row */}
        {!selected && !paymentSuccess && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, justifyContent: 'center', marginBottom: 8 }}>
            <button style={{ flex: 1, padding: 18, borderRadius: 10, fontSize: 18, fontWeight: 600, background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setSelected('upi')}>UPI</button>
            <button style={{ flex: 1, padding: 18, borderRadius: 10, fontSize: 18, fontWeight: 600, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setSelected('credit')}>Credit Card</button>
            <button style={{ flex: 1, padding: 18, borderRadius: 10, fontSize: 18, fontWeight: 600, background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setSelected('debit')}>Debit Card</button>
          </div>
        )}
        {/* UPI Form */}
        {selected === 'upi' && !paymentSuccess && (
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
        {selected === 'credit' && !paymentSuccess && (
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
        {selected === 'debit' && !paymentSuccess && (
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
        {/* After payment success */}
        {paymentSuccess && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mt-6 text-center font-semibold">
            Payment is successful. Your mediator will be assigned shortly.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods; 