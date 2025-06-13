import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // For global styles (like Tailwind's base styles if you configure it locally)
import App from './App'; // Import your main App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
