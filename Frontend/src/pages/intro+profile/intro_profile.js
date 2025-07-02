import React, { useState, useEffect, useRef } from 'react';
import ProfilePageUser from './ProfilePage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ onLoginSuccess }) => {
  const [mobileEmail, setMobileEmail] = useState('');
  const [mobileEmailError, setMobileEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const timerRef = useRef(null);
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false); // For API call state
  const navigate = useNavigate();

  const validateMobileEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // validate for 10-digit indian mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    return emailRegex.test(input) || mobileRegex.test(input);
  };

  const handleSendOtp = async () => {
    if (!mobileEmail.trim()) {
      setMobileEmailError('Please enter a mobile number or email');
      return;
    }

    if (!validateMobileEmail(mobileEmail.trim())) {
      setMobileEmailError('Please enter a valid mobile number or email');
      return;
    }

    setMobileEmailError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/users/send-otp', { mobileEmail: mobileEmail.trim() });
      setShowOtpSection(true);
      startCountdown();
      alert('OTP sent to console successfully!'); // Replaced with console log on backend
    } catch (error) {
      setMobileEmailError(error.response?.data?.msg || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    setShowResend(false);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = () => {
    startCountdown();
    alert('OTP resent successfully! Use 123456 to verify.');
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }
    setOtpError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/users/verify-otp', {
        mobileEmail: mobileEmail.trim(),
        otp: otp,
      });

      // Store token
      localStorage.setItem('token', res.data.token);

      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      clearInterval(timerRef.current);
      
      // Pass user data up to the parent to handle navigation
      onLoginSuccess(role, res.data.user);

    } catch (error) {
      setOtpError(error.response?.data?.msg || 'Failed to verify OTP.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Google login successful!');
    onLoginSuccess(role);
  };

  const handleRoleLogin = () => {
    if (!username || !password) {
      setLoginError('Please enter username and password');
      return;
    }
    setLoginError('');
    alert(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);
    onLoginSuccess(role);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="layout-container flex h-full grow flex-col relative" style={{ fontFamily: 'Epilogue, Noto Sans, sans-serif' }}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="./wedding_card.jpg" alt="Wedding Background" className="w-full h-full object-cover opacity-90" />
      </div>
      
      {/* Content with overlay */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Centered Title at Top */}
        <div className="flex justify-center items-center pt-8 pb-4">
          <div className="flex items-center gap-4 text-white">
            <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.015em] drop-shadow-lg">Viya</h1>
            <img src="/logo_nobg.png" alt="Viya Matrimony Logo" className="h-24 w-auto drop-shadow-lg" />
            <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.015em] drop-shadow-lg">Matrimony</h1>
          </div>
        </div>

        {/* Centered Login Container */}
        <div className="flex flex-1 justify-center items-center px-4">
          <div className="w-full max-w-md">
            {/* Wedding Card Style Login Box */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 overflow-hidden">
              {/* Role Selection */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${role === 'user' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'}`}
                  onClick={() => setRole('user')}
                >
                  User
                </button>
                <button
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${role === 'manager' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'}`}
                  onClick={() => setRole('manager')}
                >
                  Manager
                </button>
                <button
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${role === 'admin' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'}`}
                  onClick={() => setRole('admin')}
                >
                  Admin
                </button>
              </div>
              {/* Content */}
              <div className="relative z-10">
                {role === 'user' && (
                  <>
                    <h2 className="text-[#1a0f10] tracking-light text-[28px] font-bold leading-tight text-center pb-6 pt-2">User Login / Registration</h2>
                    {/* Mobile/Email Input with Validation */}
                    <div className="flex flex-wrap items-end gap-4 py-3">
                      <label className="flex flex-col flex-1">
                        <input
                          type="text"
                          placeholder="Mobile Number or Email"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1a0f10] focus:outline-0 focus:ring-2 focus:ring-red-400 border-2 border-orange-200 bg-white focus:border-red-400 h-14 placeholder:text-[#93535b] p-[15px] text-base font-normal leading-normal"
                          value={mobileEmail}
                          onChange={(e) => setMobileEmail(e.target.value)}
                          required
                        />
                        {mobileEmailError && (
                          <span className="text-red-500 text-xs mt-1">{mobileEmailError}</span>
                        )}
                      </label>
                    </div>
                    {/* Send OTP Button */}
                    <div className="flex py-3">
                      <button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        <span className="truncate">{loading ? 'Sending...' : 'Send OTP'}</span>
                      </button>
                    </div>
                    {/* OTP Input Field (Initially Hidden) */}
                    {showOtpSection && (
                      <div className="slide-up">
                        <div className="flex flex-wrap items-end gap-4 py-3">
                          <label className="flex flex-col flex-1">
                            <input
                              type="text"
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              pattern="[0-9]{6}"
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1a0f10] focus:outline-0 focus:ring-2 focus:ring-red-400 border-2 border-orange-200 bg-white focus:border-red-400 h-14 placeholder:text-[#93535b] p-[15px] text-base font-normal leading-normal text-center text-lg tracking-widest"
                              value={otp}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                setOtp(value);
                                if (value.length === 6) {
                                  setTimeout(() => {
                                    handleVerifyOtp();
                                  }, 500);
                                }
                              }}
                            />
                            {otpError && (
                              <span className="text-red-500 text-xs mt-1">{otpError}</span>
                            )}
                          </label>
                        </div>
                        {/* OTP Timer and Resend */}
                        <div className="flex justify-between items-center py-2">
                          {!showResend ? (
                            <span className="text-sm text-gray-600">Resend OTP in <span>{countdown}</span>s</span>
                          ) : (
                            <button 
                              onClick={handleResendOtp}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                        {/* Verify OTP Button */}
                        <div className="flex py-3">
                          <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg transition-all duration-200 disabled:opacity-50"
                          >
                            <span className="truncate">{loading ? 'Verifying...' : 'Verify OTP'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Social Login */}
                    <div className="py-4">
                      <div className="flex items-center justify-center mb-4">
                        <div className="border-t border-gray-300 flex-grow mr-3"></div>
                        <span className="text-gray-500 text-sm">OR</span>
                        <div className="border-t border-gray-300 flex-grow ml-3"></div>
                      </div>
                      <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center w-full h-12 px-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 bg-white text-gray-700 font-medium transition-all duration-200"
                      >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </button>
                    </div>
                  </>
                )}
                {(role === 'manager' || role === 'admin') && (
                  <>
                    <h2 className="text-[#1a0f10] tracking-light text-[28px] font-bold leading-tight text-center pb-6 pt-2">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
                    <div className="flex flex-col gap-4 py-3">
                      <label className="flex flex-col">
                        <input
                          type="text"
                          placeholder="Username"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1a0f10] focus:outline-0 focus:ring-2 focus:ring-red-400 border-2 border-orange-200 bg-white focus:border-red-400 h-14 placeholder:text-[#93535b] p-[15px] text-base font-normal leading-normal"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </label>
                      <label className="flex flex-col">
                        <input
                          type="password"
                          placeholder="Password"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1a0f10] focus:outline-0 focus:ring-2 focus:ring-red-400 border-2 border-orange-200 bg-white focus:border-red-400 h-14 placeholder:text-[#93535b] p-[15px] text-base font-normal leading-normal"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </label>
                      {loginError && <span className="text-red-500 text-xs mt-1">{loginError}</span>}
                    </div>
                    <div className="flex py-3">
                      <button
                        onClick={handleRoleLogin}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg transition-all duration-200"
                      >
                        <span className="truncate">Login</span>
                      </button>
                    </div>
                  </>
                )}
                {/* Conditional Links */}
                <p className="text-center text-sm text-gray-600 mt-4">
                  By continuing, you agree to our <a href="/terms" className="text-red-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-red-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ onProfileComplete, isManager }) => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    city: '',
    state: '',
    country: '',
    occupation: '',
    education: '',
    height: '',
    aboutMe: '',
    interests: [],
    photos: [],
    profilePicture: '',
    // The component still has other fields, but we only need to manage the state for those we save
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in. Please log in again.');
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.put('http://localhost:5000/users/me', profileData, config);

      alert('Profile saved successfully!');
      
      localStorage.removeItem('profileDraft');
      if (onProfileComplete) {
        onProfileComplete(isManager);
      }

    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error saving profile. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
       {/* All the input fields will use `profileData` for value and `handleInputChange` for onChange */}
       <input name="fullName" value={profileData.fullName} onChange={handleInputChange} placeholder="Full Name" />
       <input name="dob" type="date" value={profileData.dob} onChange={handleInputChange} />
       {/* ... other fields like city, occupation, etc. */}
       <button type="submit">Submit Profile</button>
    </form>
  );
};

const App = ({ onProfileComplete, isManager: externalIsManager }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();

  const handleLoginSuccess = (loginRole, user) => {
    // Defensive check to prevent crash
    if (!user) {
      console.error("Login success was called without a user object. Role:", loginRole);
      // For now, we can assume a default state or show an error
      // For Google/Manager login, you'll need to fetch user data separately
      // or adjust the login flow.
      // Let's simulate a basic user object to avoid crashing.
      user = { isProfileComplete: false };
    }

    setUserRole(loginRole);
    if (loginRole === 'user') {
      if (user.isProfileComplete) {
        navigate('/dashboard');
      } else {
        setIsLoggedIn(true);
      }
    } else if (loginRole === 'manager') {
      navigate('/manager');
    } else if (loginRole === 'admin') {
      navigate('/admin');
    }
  };

  const handleProfileComplete = () => {
    // ... existing code ...
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-red-500 via-orange-500 to-red-600 group/design-root overflow-x-hidden" id="appContainer">
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        userRole === 'manager' ? (
          <ProfilePage onProfileComplete={() => onProfileComplete(true)} isManager={true} />
        ) : userRole === 'user' ? (
          <ProfilePageUser onProfileComplete={() => onProfileComplete(false)} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white text-2xl font-bold">Admin Dashboard (Coming Soon)</div>
        )
      )}
    </div>
  );
};

export default App;