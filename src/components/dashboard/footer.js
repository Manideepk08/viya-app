// src/components/Footer.js
import React from 'react';

const openHelpFAQ = (tab) => {
  window.open(`/help-faq?tab=${tab}`, '_blank', 'noopener,noreferrer');
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 p-6 mt-8 rounded-t-lg">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Viya Matrimony. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <button className="hover:text-white transition-colors" onClick={() => openHelpFAQ('privacy')}>Privacy Policy</button>
          <button className="hover:text-white transition-colors" onClick={() => openHelpFAQ('terms')}>Terms of Service</button>
          <button className="hover:text-white transition-colors" onClick={() => openHelpFAQ('contact')}>Contact Us</button>
          <button className="hover:text-white transition-colors" onClick={() => openHelpFAQ('faq')}>FAQ</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
