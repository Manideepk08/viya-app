import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css'; // Import the new CSS file

// Add Google Fonts in the document head if not already present
if (typeof document !== 'undefined') {
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Great+Vibes&display=swap';
  fontLink.rel = 'stylesheet';
  if (!document.head.querySelector('link[href*="Cinzel"]')) {
    document.head.appendChild(fontLink);
  }
}

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLetsGo = () => {
    navigate('/intro-profile');
  };

  return (
    <>
      <div 
        className="flex flex-col items-center justify-center h-screen welcome-container relative"
        style={{}}
      >
        {/* Grid background */}
        <div className="welcome-bg-grid absolute inset-0 w-full h-full z-0 pointer-events-none">
          <img src={require('./vaibhav-nagare-JizEew4-FcY-unsplash.jpg')} alt="bg1" className="grid-img" />
          <img src={require('./sean-williams-d-jyMeP6uNQ-unsplash.jpg')} alt="bg2" className="grid-img" />
          <img src={require('./pexels-vireshstudio-1444442.jpg')} alt="bg3" className="grid-img" />
          <img src={require('./pexels-kumar-saurabh-625146-1456613.jpg')} alt="bg4" className="grid-img" />
          <img src={require('./pexels-amolnandiwadekar-1707446.jpg')} alt="bg5" className="grid-img" />
          <img src={require('./maheshkumar-s-mElfxbz4O7w-unsplash.jpg')} alt="bg6" className="grid-img" />
          <img src={require('./aastha-bansal-W1wkx5kcaBk-unsplash.jpg')} alt="bg7" className="grid-img" />
          <img src={require('./b56af293-f160-49b8-8b72-b6de058bb00f.jpeg')} alt="bg8" className="grid-img" />
          <img src={require('./ac6c7e03-df08-42a5-b73f-8517f457504d.jpeg')} alt="bg9" className="grid-img" />
          <img src={require('./You effortlessly make me laugh harder with your….jpeg')} alt="bg10" className="grid-img" />
          <img src={require('./Contact HappeningPro to capture your best….jpeg')} alt="bg11" className="grid-img" />
          <img src={require('./1b7f4294-a924-49f4-8d08-4257a5face36.jpeg')} alt="bg12" className="grid-img" />
          <img src={require('./07142d4a-093e-4246-a15b-5aaf53fb37aa.jpeg')} alt="bg13" className="grid-img" />
          <div className="grid-overlay"></div>
        </div>
        <div className="petals">
          {[...Array(10)].map((_, i) => <div key={i} className="petal"></div>)}
        </div>
        <div className="flex flex-col items-center justify-between h-3/4 py-12 welcome-content frosted-glass-glow z-10">
          <div className="flex flex-col items-center">
            <div className="logo-glow">
              <img src="/logo_nobg.png" alt="Viya Matrimony Logo" className="w-40 h-40 mb-6 animate-pulse-logo" />
            </div>
            <h1
              className="text-center mb-2"
              style={{
                fontFamily: 'Cinzel, serif',
                fontWeight: 'bold',
                fontSize: '3.2rem',
                color: '#fff',
                textShadow: '0 2px 16px #000, 2px 2px 8px rgba(0,0,0,0.7)',
                letterSpacing: '2.5px',
              }}
            >
              Viya Matrimony<br />Welcomes You
            </h1>
            <p
              className="mt-2 gradient-quote"
              style={{
                fontFamily: 'Great Vibes, cursive',
                color: '#f8f9fa',
                fontSize: '1.3rem',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                fontStyle: 'italic',
                opacity: 0.9,
              }}
            >
              "Two souls, one destiny — let your search for a lifetime partner begin here."
            </p>
          </div>
          <button
            onClick={handleLetsGo}
            className="lets-go-btn-pink mt-8 flex items-center justify-center gap-2"
            style={{
              color: '#FF4081',
              fontWeight: 'bold',
              textShadow: '1px 1px 3px #000',
            }}
          >
            <span role="img" aria-label="heart">💖</span> Let's Go
          </button>
        </div>
      </div>
    </>
  );
};

export default WelcomePage; 