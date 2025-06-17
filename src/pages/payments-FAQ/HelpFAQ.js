import React, { useState } from 'react';
import './HelpFAQ.css';

const faqData = [
  {
    question: 'How do I send an interest to another profile?',
    answer: 'Click on the "Send Interest" button on the profile you like. You will need to pay ₹199 to send the interest.'
  },
  {
    question: 'What is the role of a mediator?',
    answer: 'Mediators help facilitate matches by verifying profiles and coordinating between families.'
  },
  {
    question: 'How are mediators assigned?',
    answer: 'Mediators are automatically assigned based on your location (pincode).'
  },
  {
    question: 'Why are same Gotra matches blocked?',
    answer: 'Our system respects traditional practices by blocking same Gotra matches.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept cards, UPI, net banking via Razorpay/Stripe.'
  }
];

const HelpFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return React.createElement('div', { className: 'help-faq-container' },
    React.createElement('div', { className: 'help-header' },
      React.createElement('h1', null, 'Help Center'),
      React.createElement('p', null, 'Find answers to common questions')
    ),
    
    React.createElement('div', { className: 'search-container' },
      React.createElement('div', { className: 'search-box' },
        React.createElement('svg', { viewBox: '0 0 24 24' },
          React.createElement('path', { fill: 'currentColor', d: 'M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z' })
        ),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search help articles...',
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value)
        })
      )
    ),
    
    React.createElement('div', { className: 'faq-section' },
      React.createElement('h2', null, 'Frequently Asked Questions'),
      
      filteredFAQs.length > 0 ? (
        React.createElement('div', { className: 'faq-list' },
          filteredFAQs.map((faq, index) => 
            React.createElement('div', { 
              key: index,
              className: `faq-item ${activeIndex === index ? 'active' : ''}`,
              onClick: () => toggleFAQ(index)
            },
              React.createElement('div', { className: 'faq-question' },
                React.createElement('h4', null, faq.question),
                React.createElement('svg', { viewBox: '0 0 24 24' },
                  React.createElement('path', { fill: 'currentColor', d: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z' })
                )
              ),
              activeIndex === index && (
                React.createElement('div', { className: 'faq-answer' },
                  React.createElement('p', null, faq.answer)
                )
              )
            )
          )
        )
      ) : (
        React.createElement('div', { className: 'no-results' },
          React.createElement('svg', { viewBox: '0 0 24 24' },
            React.createElement('path', { fill: 'currentColor', d: 'M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M10,4A4,4 0 0,1 14,8C14,8.91 13.69,9.75 13.18,10.43C12.32,10.75 11.55,11.26 10.91,11.9L10,12A4,4 0 0,1 6,8A4,4 0 0,1 10,4M2,20V18C2,15.88 5.31,14.14 9.5,14C9.18,14.78 9,15.62 9,16.5C9,17.79 9.38,19 10,20H2Z' })
          ),
          React.createElement('p', null, `No results found for "${searchTerm}"`)
        )
      )
    ),
    
    React.createElement('div', { className: 'contact-section' },
      React.createElement('h3', null, 'Still need help?'),
      React.createElement('p', null, 'Our support team is available to assist you'),
      
      React.createElement('div', { className: 'contact-methods' },
        React.createElement('div', { className: 'contact-card' },
          React.createElement('div', { className: 'contact-icon' },
            React.createElement('svg', { viewBox: '0 0 24 24' },
              React.createElement('path', { fill: 'currentColor', d: 'M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z' })
            )
          ),
          React.createElement('h4', null, 'Email Support'),
          React.createElement('p', null, 'support@matrimonyapp.com'),
          React.createElement('p', null, 'Typically responds within 24 hours')
        ),
        
        React.createElement('div', { className: 'contact-card' },
          React.createElement('div', { className: 'contact-icon' },
            React.createElement('svg', { viewBox: '0 0 24 24' },
              React.createElement('path', { fill: 'currentColor', d: 'M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z' })
            )
          ),
          React.createElement('h4', null, 'Call Us'),
          React.createElement('p', null, '+91 9876543210'),
          React.createElement('p', null, 'Mon-Sat, 10AM to 7PM')
        ),
        
        React.createElement('div', { className: 'contact-card' },
          React.createElement('div', { className: 'contact-icon' },
            React.createElement('svg', { viewBox: '0 0 24 24' },
              React.createElement('path', { fill: 'currentColor', d: 'M12,3C16.97,3 21,7.03 21,12C21,16.97 16.97,21 12,21C7.03,21 3,16.97 3,12C3,7.03 7.03,3 12,3M12,5C8.14,5 5,8.14 5,12C5,15.86 8.14,19 12,19C15.86,19 19,15.86 19,12C19,8.14 15.86,5 12,5M11,13V15H13V13H11M11,7V12H13V7H11Z' })
            )
          ),
          React.createElement('h4', null, 'Live Chat'),
          React.createElement('p', null, 'Click the chat icon below'),
          React.createElement('p', null, 'Available 9AM-8PM daily')
        )
      )
    )
  );
};

export default HelpFAQ;