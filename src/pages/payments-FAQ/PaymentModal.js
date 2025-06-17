import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ show, onClose, amount = 199 }) => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [paymentStatus, setPaymentStatus] = useState('idle');

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (paymentMethod === 'razorpay') {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: amount * 100,
          currency: 'INR',
          name: 'Matrimony App',
          description: 'Send Interest Payment',
          handler: function(response) {
            setPaymentStatus('success');
            console.log('Payment ID:', response.razorpay_payment_id);
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com',
            contact: '9876543210'
          },
          theme: {
            color: '#6a1b9a'
          }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPaymentStatus('success');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    }
  };

  if (!show) return null;

  return React.createElement('div', { className: 'payment-modal-overlay' },
    React.createElement('div', { className: 'payment-modal' },
      React.createElement('button', { 
        className: 'close-btn', 
        onClick: onClose 
      }, '×'),
      
      React.createElement('h3', null, 'Send Interest'),
      React.createElement('p', { className: 'payment-amount' }, `Amount: ₹${amount}`),
      
      paymentStatus === 'success' ? (
        React.createElement('div', { className: 'payment-success' },
          React.createElement('svg', { viewBox: '0 0 24 24' },
            React.createElement('path', { fill: 'currentColor', d: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z' })
          ),
          React.createElement('p', null, 'Payment successful! Your interest has been sent.'),
          React.createElement('button', { 
            className: 'btn btn-primary', 
            onClick: onClose 
          }, 'Close')
        )
      ) : (
        React.createElement(React.Fragment, null,
          React.createElement('div', { className: 'payment-methods' },
            React.createElement('label', { 
              className: paymentMethod === 'razorpay' ? 'active' : '' 
            },
              React.createElement('input', {
                type: 'radio',
                name: 'paymentMethod',
                value: 'razorpay',
                checked: paymentMethod === 'razorpay',
                onChange: () => setPaymentMethod('razorpay')
              }),
              React.createElement('img', { 
                src: '/payment-icons/razorpay.png', 
                alt: 'Razorpay' 
              })
            ),
            
            React.createElement('label', { 
              className: paymentMethod === 'stripe' ? 'active' : '' 
            },
              React.createElement('input', {
                type: 'radio',
                name: 'paymentMethod',
                value: 'stripe',
                checked: paymentMethod === 'stripe',
                onChange: () => setPaymentMethod('stripe')
              }),
              React.createElement('img', { 
                src: '/payment-icons/stripe.png', 
                alt: 'Stripe' 
              })
            )
          ),
          
          React.createElement('button', {
            className: 'btn btn-primary pay-now-btn',
            onClick: handlePayment,
            disabled: paymentStatus === 'processing'
          },
            paymentStatus === 'processing' ? (
              React.createElement(React.Fragment, null,
                React.createElement('span', { className: 'spinner' }),
                ' Processing...'
              )
            ) : 'Pay Now'
          ),
          
          paymentStatus === 'failed' && (
            React.createElement('div', { className: 'payment-error' },
              'Payment failed. Please try again or use a different method.'
            )
          ),
          
          React.createElement('div', { className: 'payment-security' },
            React.createElement('svg', { viewBox: '0 0 24 24' },
              React.createElement('path', { fill: 'currentColor', d: 'M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z' })
            ),
            React.createElement('span', null, `Secure payment processed via ${paymentMethod === 'razorpay' ? 'Razorpay' : 'Stripe'}`)
          )
        )
      )
    )
  );
};

export default PaymentModal;