import React, { useEffect, useState } from 'react';

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

const TABS = [
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'terms', label: 'Terms of Service' },
  { key: 'contact', label: 'Contact Us' },
  { key: 'faq', label: 'FAQ' },
];

const tabContent = {
  privacy: (
    <div>
      <h2 className="text-xl font-bold mb-2">Privacy Policy</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Your privacy is important to us. We are committed to protecting your personal information and your right to privacy.</li>
        <li>When you use our service, we may collect certain information such as your name, contact details, and profile information to provide and improve our services.</li>
        <li>We do not share your personal information with third parties except as necessary to provide our services or as required by law.</li>
        <li>We use industry-standard security measures to protect your data.</li>
        <li>By using our service, you consent to our collection and use of your information as described in this policy.</li>
        <li>If you have any questions or concerns about our privacy practices, please contact us at <a href="mailto:support@viya.com" className="text-orange-600 underline">support@viya.com</a>.</li>
      </ul>
    </div>
  ),
  terms: (
    <div>
      <h2 className="text-xl font-bold mb-2">Terms of Service</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>By using our website and services, you agree to comply with and be bound by the following terms and conditions.</li>
        <li>You must be at least 18 years old to use our service.</li>
        <li>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</li>
        <li>You agree not to use our service for any unlawful or prohibited activities.</li>
        <li>We reserve the right to modify or terminate our service at any time without notice.</li>
        <li>We are not responsible for any damages or losses resulting from your use of our service.</li>
        <li>Your continued use of the service constitutes your acceptance of any changes to these terms.</li>
        <li>If you do not agree with any part of these terms, please do not use our service.</li>
      </ul>
    </div>
  ),
  contact: <div><h2 className="text-xl font-bold mb-2">Contact Us</h2><p>Contact us at support@viya.com or call 1800-123-456.</p></div>,
  faq: <div><h2 className="text-xl font-bold mb-2">FAQ</h2><p>Frequently Asked Questions will appear here...</p></div>,
};

const getInitialTab = () => {
  // Check for ?tab= in the URL
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab && TABS.some(t => t.key === tab)) return tab;
  return 'privacy';
};

const HelpFAQ = () => {
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Update URL when tab changes (optional)
    window.history.replaceState(null, '', `?tab=${activeTab}`);
  }, [activeTab]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with logo */}
      <nav className="bg-orange-500 p-4 text-white font-bold text-lg flex items-center">
        <img src="/logo_nobg.png" alt="Viya Matrimony Logo" className="h-10 w-auto mr-3" />
        <span>Viya Matrimony</span>
      </nav>
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex space-x-4 border-b mb-6 pb-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`pb-2 px-4 font-semibold border-b-2 transition-colors ${activeTab === tab.key ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-orange-500'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {activeTab === 'faq' ? (
            <div>
              <h2 className="text-xl font-bold mb-4">FAQ</h2>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div>
                {filteredFAQs.length === 0 ? (
                  <p className="text-gray-500">No questions found.</p>
                ) : (
                  filteredFAQs.map((faq, idx) => (
                    <div key={idx} className="mb-3 border-b">
                      <button
                        className="w-full text-left flex justify-between items-center py-2 font-medium focus:outline-none"
                        onClick={() => toggleFAQ(idx)}
                      >
                        <span>{faq.question}</span>
                        <span>{activeIndex === idx ? '−' : '+'}</span>
                      </button>
                      {activeIndex === idx && (
                        <div className="pl-2 pb-2 text-gray-700 animate-fade-in">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            tabContent[activeTab]
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpFAQ;