import React, { useState, useEffect, useRef } from 'react';

const LoginPage = ({ onLoginSuccess }) => {
  const [mobileEmail, setMobileEmail] = useState('');
  const [mobileEmailError, setMobileEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const [isMediator, setIsMediator] = useState(false);
  const timerRef = useRef(null);

  const validateMobileEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    return emailRegex.test(input) || mobileRegex.test(input);
  };

  const handleSendOtp = () => {
    if (!mobileEmail.trim()) {
      setMobileEmailError('Please enter a mobile number or email');
      return;
    }

    if (!validateMobileEmail(mobileEmail.trim())) {
      setMobileEmailError('Please enter a valid mobile number or email');
      return;
    }

    setMobileEmailError('');
    setShowOtpSection(true);
    startCountdown();
    alert('OTP sent successfully! Use 123456 to verify.');
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

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }

    if (otp === '123456') {
      setOtpError('');
      clearInterval(timerRef.current);
      alert('OTP verified successfully!');
      onLoginSuccess(isMediator);
    } else {
      setOtpError('Invalid OTP. Please use 123456');
      setOtp('');
    }
  };

  const handleGoogleLogin = () => {
    alert('Google login successful!');
    onLoginSuccess(isMediator);
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
            <img src="./logo_nobg.png" alt="Viya Matrimony Logo" className="h-24 w-auto drop-shadow-lg" />
            <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.015em] drop-shadow-lg">Matrimony</h1>
          </div>
        </div>

        {/* Centered Login Container */}
        <div className="flex flex-1 justify-center items-center px-4">
          <div className="w-full max-w-md">
            {/* Wedding Card Style Login Box */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 overflow-hidden">
              {/* Content */}
              <div className="relative z-10">
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
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg transition-all duration-200"
                  >
                    <span className="truncate">Send OTP</span>
                  </button>
                </div>

                {/* I'm a Mediator Toggle */}
                <div className="flex items-center gap-4 bg-orange-50 rounded-lg px-4 min-h-14 justify-between border border-orange-200 mb-4">
                  <p className="text-[#1a0f10] text-base font-medium leading-normal flex-1 truncate">I'm a Mediator</p>
                  <div className="shrink-0">
                    <label
                      className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 ${isMediator ? 'justify-end bg-gradient-to-r from-red-500 to-orange-500' : 'bg-orange-200'}`}
                    >
                      <div className="h-full w-[27px] rounded-full bg-white" style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px' }}></div>
                      <input 
                        type="checkbox" 
                        className="invisible absolute" 
                        checked={isMediator}
                        onChange={() => setIsMediator(!isMediator)}
                      />
                    </label>
                  </div>
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
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg transition-all duration-200"
                      >
                        <span className="truncate">Verify OTP</span>
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

const ProfilePage = ({ onProfileComplete, isMediator }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    maritalStatus: '',
    community: 'Banjara',
    gothram: '',
    language: '',
    religion: '',
    pinCode: '',
    education: '',
    jobTitle: '',
    companyName: '',
    monthlyIncome: '',
    workCity: '',
    workState: '',
    fatherName: '',
    motherName: '',
    siblings: '',
    familyStatus: '',
    preferredAgeRange: '',
    preferredState: '',
    preferredEducation: '',
    preferredReligion: '',
    gotraExclusion: '',
    aboutMe: '',
    lookingFor: '',
    profilePhotos: [],
    profileVideos: [],
    // Mediator-specific fields
    email: '',
    phone: '',
    experience: '',
    specialization: '',
    commissionRate: ''
  });

  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxPhotos = isMediator ? 3 : 5;
    
    if (photoPreviews.length + files.length > maxPhotos) {
      alert(`You can upload a maximum of ${maxPhotos} photos`);
      return;
    }
    
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      profilePhotos: [...prev.profilePhotos, ...files]
    }));
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (videoPreviews.length + files.length > 3) {
      alert('You can upload a maximum of 3 videos');
      return;
    }
    
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setVideoPreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      profileVideos: [...prev.profileVideos, ...files]
    }));
  };

  const removePhoto = (index) => {
    const newPreviews = [...photoPreviews];
    newPreviews.splice(index, 1);
    setPhotoPreviews(newPreviews);
    
    const newFiles = [...formData.profilePhotos];
    newFiles.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      profilePhotos: newFiles
    }));
  };

  const removeVideo = (index) => {
    const newPreviews = [...videoPreviews];
    newPreviews.splice(index, 1);
    setVideoPreviews(newPreviews);
    
    const newFiles = [...formData.profileVideos];
    newFiles.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      profileVideos: newFiles
    }));
  };

  const saveDraft = () => {
    alert('Draft saved successfully!');
    // Here you would typically save to localStorage or send to a server
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isMediator) {
      // Mediator profile validation
      if (!formData.fullName || !formData.email || !formData.phone || !formData.experience) {
        alert('Please fill in all required fields for mediator profile.');
        return false;
      }
      
      alert('Mediator profile created successfully! Redirecting to mediator dashboard...');
    } else {
      // Regular user profile validation
      // Age validation
      if (formData.dob) {
        const age = calculateAge(formData.dob);
        if (age < 18) {
          alert('You must be at least 18 years old to create a profile.');
          return false;
        }
      }

      // Photo validation
      if (formData.profilePhotos.length === 0) {
        alert('Profile photo is required.');
        return false;
      }

      // Gothram validation
      if (!formData.gothram) {
        alert('Gothram selection is mandatory.');
        return false;
      }

      // Pin code validation
      if (formData.pinCode && !/^[0-9]{6}$/.test(formData.pinCode)) {
        alert('Please enter a valid 6-digit pin code.');
        return false;
      }

      // About Me word count validation
      if (formData.aboutMe) {
        const aboutMeWords = formData.aboutMe.trim().split(/\s+/).length;
        if (aboutMeWords < 30) {
          alert('About Me section must contain at least 30 words.');
          return false;
        }
      }

      alert('Profile created successfully! Redirecting to dashboard...');
    }
    
    // Call the callback to notify the parent component
    if (onProfileComplete) {
      onProfileComplete();
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      photoPreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
      videoPreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [photoPreviews, videoPreviews]);

  return (
    <div className="layout-container flex h-full grow flex-col relative bg-amber-50" style={{ fontFamily: 'Manrope, Noto Sans, sans-serif' }}>
      {/* Thoranam image row at the top - only for regular users */}
      {!isMediator && (
        <div className="w-full flex flex-row bg-amber-50" style={{ height: '80px' }}>
          <img src="./thoraanam_nobg.png" alt="Thoranam" className="h-full w-1/3 object-cover" />
          <img src="./thoraanam_nobg.png" alt="Thoranam" className="h-full w-1/3 object-cover" />
          <img src="./thoraanam_nobg.png" alt="Thoranam" className="h-full w-1/3 object-cover" />
        </div>
      )}
      
      {/* Logo Container */}
      <div className="flex justify-center items-center py-4 bg-amber-50">
        <div className="flex items-center gap-4">
          <h1 className="text-[#1a0f10] text-2xl font-bold leading-tight tracking-[-0.015em]">Viya</h1>
          <img src="./logo_nobg.png" alt="Viya Matrimony Logo" className="h-16 w-auto" />
          <h1 className="text-[#1a0f10] text-2xl font-bold leading-tight tracking-[-0.015em]">Matrimony</h1>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="flex-1">
        <div className="px-2 sm:px-4 md:px-6 lg:px-10 flex flex-1 justify-center py-1 relative z-10">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 bg-white rounded-lg shadow-lg p-6 sm:p-8 relative">
            {/* Little Fingers No Background Image covering entire screen - only for regular users */}
            {!isMediator && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <img src="./littlefingers_nobg.png" alt="Little Fingers No Background" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex flex-wrap justify-between gap-2 p-2 relative z-20">
              <p className="text-gray-800 tracking-tight text-[20px] sm:text-[24px] font-bold leading-tight min-w-72">
                {isMediator ? 'Create Mediator Profile' : 'Create Your Profile'}
              </p>
            </div>
              
            <form id="profileForm" onSubmit={handleSubmit} className="relative z-20" key={`form-${isMediator}`}>
              {/* Personal Information */}
              <h3 className="text-gray-700 text-sm font-bold leading-tight tracking-[-0.015em] px-3 pb-1 pt-2">
                {isMediator ? 'Basic Information' : 'Personal Information'}
              </h3>
              <div className="flex flex-wrap gap-3 px-3 py-1">
                <label className="flex flex-col min-w-36 flex-1">
                  <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Full Name <span className="text-red-600 font-bold text-base">*</span></p>
                  <input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                  />
                </label>
                
                {!isMediator && (
                  <>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Gender <span className="text-red-600 font-bold text-base">*</span></p>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select your gender</option>
                        <option value="boy">Boy</option>
                        <option value="girl">Girl</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Date of Birth <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        required
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Marital Status <span className="text-red-600 font-bold text-base">*</span></p>
                      <select
                        id="maritalStatus"
                        name="maritalStatus"
                        required
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select your marital status</option>
                        <option value="single">Single</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </label>
                  </>
                )}

                {isMediator === true && (
                  <>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Email <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Phone Number <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Years of Experience <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        placeholder="Enter years of experience"
                        required
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                  </>
                )}
              </div>

              {!isMediator && (
                <>
                  {/* Community Details */}
                  <h3 className="text-gray-700 text-sm font-bold leading-tight tracking-[-0.015em] px-3 pb-1 pt-2">Community Details</h3>
                  <div className="flex flex-wrap gap-3 px-3 py-1">
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Community <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="community"
                        name="community"
                        value="Banjara"
                        readOnly
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Gothram <span className="text-red-600 font-bold text-base">*</span></p>
                      <select
                        id="gothram"
                        name="gothram"
                        required
                        value={formData.gothram}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select your gothram</option>
                        <option value="bharadwaj">Bharadwaj</option>
                        <option value="kashyap">Kashyap</option>
                        <option value="gautam">Gautam</option>
                        <option value="vashistha">Vashistha</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Language</p>
                      <input
                        id="language"
                        name="language"
                        placeholder="Enter your language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Religion</p>
                      <select
                        id="religion"
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select your religion</option>
                        <option value="hindu">Hindu</option>
                        <option value="muslim">Muslim</option>
                        <option value="christian">Christian</option>
                        <option value="sikh">Sikh</option>
                        <option value="buddhist">Buddhist</option>
                        <option value="jain">Jain</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Pin Code <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="pinCode"
                        name="pinCode"
                        placeholder="Enter your pin code"
                        required
                        pattern="[0-9]{6}"
                        title="Pin code must be 6 digits"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                  </div>
                </>
              )}

              {/* Professional Information */}
              <h3 className="text-gray-700 text-sm font-bold leading-tight tracking-[-0.015em] px-3 pb-1 pt-2">
                {isMediator ? 'Professional Information' : 'Professional Information'}
              </h3>
              <div className="flex flex-wrap gap-3 px-3 py-1">
                {!isMediator ? (
                  <>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Education <span className="text-red-600 font-bold text-base">*</span></p>
                      <select
                        id="education"
                        name="education"
                        required
                        value={formData.education}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select your education</option>
                        <option value="graduate">Graduate</option>
                        <option value="postgraduate">Post Graduate</option>
                        <option value="doctorate">Doctorate</option>
                        <option value="diploma">Diploma</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Job Title</p>
                      <input
                        id="jobTitle"
                        name="jobTitle"
                        placeholder="Enter your job title"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Company Name</p>
                      <input
                        id="companyName"
                        name="companyName"
                        placeholder="Enter your company name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Monthly Income</p>
                      <input
                        id="monthlyIncome"
                        name="monthlyIncome"
                        placeholder="Enter your monthly income"
                        type="number"
                        value={formData.monthlyIncome}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Work Location - City <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="workCity"
                        name="workCity"
                        placeholder="Enter your city"
                        required
                        value={formData.workCity}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Work Location - State <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="workState"
                        name="workState"
                        placeholder="Enter your state"
                        required
                        value={formData.workState}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Specialization</p>
                      <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select specialization</option>
                        <option value="arranged-marriage">Arranged Marriage</option>
                        <option value="love-marriage">Love Marriage</option>
                        <option value="inter-caste">Inter-caste Marriage</option>
                        <option value="inter-religion">Inter-religion Marriage</option>
                        <option value="nri-marriage">NRI Marriage</option>
                        <option value="general">General</option>
                      </select>
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Commission Rate (%)</p>
                      <input
                        id="commissionRate"
                        name="commissionRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Enter commission rate"
                        value={formData.commissionRate}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                  </>
                )}
              </div>

              {/* Family Information */}
              {!isMediator && (
                <>
                  <h3 className="text-gray-700 text-sm font-bold leading-tight tracking-[-0.015em] px-3 pb-1 pt-2">Family Information</h3>
                  <div className="flex flex-wrap gap-3 px-3 py-1">
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Father's Name <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="fatherName"
                        name="fatherName"
                        placeholder="Enter your father's name"
                        required
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Mother's Name <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="motherName"
                        name="motherName"
                        placeholder="Enter your mother's name"
                        required
                        value={formData.motherName}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Siblings</p>
                      <input
                        id="siblings"
                        name="siblings"
                        placeholder="Enter number of siblings (optional)"
                        type="number"
                        value={formData.siblings}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Family Status <span className="text-red-600 font-bold text-base">*</span></p>
                      <select
                        id="familyStatus"
                        name="familyStatus"
                        required
                        value={formData.familyStatus}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select family status</option>
                        <option value="middle">Middle Class</option>
                        <option value="upper">Upper Class</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {/* Marriage Preferences */}
              {!isMediator && (
                <>
                  <h3 className="text-gray-700 text-sm font-bold leading-tight tracking-[-0.015em] px-3 pb-1 pt-2">Marriage Preferences</h3>
                  <div className="flex flex-wrap gap-3 px-3 py-1">
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Preferred Age Range <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="preferredAgeRange"
                        name="preferredAgeRange"
                        placeholder="e.g., 25-30"
                        required
                        value={formData.preferredAgeRange}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Preferred State <span className="text-red-600 font-bold text-base">*</span></p>
                      <input
                        id="preferredState"
                        name="preferredState"
                        placeholder="Enter preferred state"
                        required
                        value={formData.preferredState}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      />
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Preferred Education <span className="text-red-600 font-bold text-base">*</span></p>
                      <select
                        id="preferredEducation"
                        name="preferredEducation"
                        required
                        value={formData.preferredEducation}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select preferred education</option>
                        <option value="graduate">Graduate</option>
                        <option value="postgraduate">Post Graduate</option>
                        <option value="doctorate">Doctorate</option>
                        <option value="diploma">Diploma</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Preferred Religion</p>
                      <select
                        id="preferredReligion"
                        name="preferredReligion"
                        value={formData.preferredReligion}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select preferred religion (optional)</option>
                        <option value="hindu">Hindu</option>
                        <option value="muslim">Muslim</option>
                        <option value="christian">Christian</option>
                        <option value="sikh">Sikh</option>
                        <option value="buddhist">Buddhist</option>
                        <option value="jain">Jain</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="flex flex-col min-w-36 flex-1">
                      <p className="text-gray-700 text-xs font-medium leading-normal pb-1">Gotra Exclusion <span className="text-red-600 font-bold text-base">*</span></p>
                      <select
                        id="gotraExclusion"
                        name="gotraExclusion"
                        required
                        value={formData.gotraExclusion}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-10 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                      >
                        <option value="">Select gotra exclusion option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {/* Profile Media */}
              <h3 className="text-gray-700 text-sm font-bold leading-tight tracking-[-0.015em] px-3 pb-1 pt-2">
                {isMediator ? 'Profile Media' : 'Profile Media'}
              </h3>
              
              {/* Photos Section */}
              <div className="px-3 py-1">
                <p className="text-gray-700 text-xs font-medium leading-normal pb-2">
                  Profile Photos 
                  {!isMediator && <span className="text-red-600 font-bold text-base">*</span>}
                  <span className="text-gray-500 text-xs">
                    {isMediator ? '(Upload up to 3 photos)' : '(Upload up to 5 photos)'}
                  </span>
                </p>
                <div className={`grid gap-2 max-w-2xl ${isMediator ? 'grid-cols-3' : 'grid-cols-4 sm:grid-cols-5'}`}>
                  {/* Photo previews */}
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square w-24 sm:w-28 bg-gray-100 rounded-lg overflow-hidden group">
                      <img src={preview.preview} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                      <button 
                        type="button" 
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Photo Button */}
                  {photoPreviews.length < (isMediator ? 3 : 5) && (
                    <div className="aspect-square w-24 sm:w-28 bg-white rounded-lg border-2 border-dashed border-gray-300 p-2 flex items-center justify-center hover:border-orange-300 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="profilePhotos"
                        name="profilePhotos"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handlePhotoUpload}
                        required={!isMediator && photoPreviews.length === 0}
                      />
                      <label htmlFor="profilePhotos" className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        <span className="text-xs text-gray-500 mt-1">Add Photos</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {!isMediator && (
                <>
                  {/* Videos Section */}
                  <div className="px-3 py-1 mt-2">
                    <p className="text-gray-700 text-xs font-medium leading-normal pb-2">Profile Videos <span className="text-gray-500 text-xs">(Upload up to 3 videos)</span></p>
                    <div className="grid grid-cols-3 gap-2 max-w-xl">
                      {/* Video previews */}
                      {videoPreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square w-24 sm:w-28 bg-gray-100 rounded-lg overflow-hidden group">
                          <video src={preview.preview} className="w-full h-full object-cover" controls />
                          <button 
                            type="button" 
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeVideo(index)}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                      
                      {/* Add Video Button */}
                      {videoPreviews.length < 3 && (
                        <div className="aspect-square w-24 sm:w-28 bg-white rounded-lg border-2 border-dashed border-gray-300 p-2 flex items-center justify-center hover:border-orange-300 transition-colors cursor-pointer">
                          <input
                            type="file"
                            id="profileVideos"
                            name="profileVideos"
                            accept="video/*"
                            className="hidden"
                            multiple
                            onChange={handleVideoUpload}
                          />
                          <label htmlFor="profileVideos" className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            <span className="text-xs text-gray-500 mt-1">Add Videos</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Bio */}
              <h3 className="text-gray-700 text-sm font-bold leading-tight tracking-[-0.015em] px-3 pb-1 pt-2">Bio</h3>
              <div className="flex flex-col sm:flex-row max-w-[1200px] flex-wrap items-end gap-3 px-3 py-1">
                <label className="flex flex-col min-w-36 flex-1">
                  <p className="text-gray-700 text-xs font-medium leading-normal pb-1">
                    {isMediator ? 'About Me' : 'About Me'} 
                    {!isMediator && <span className="text-red-600 font-bold text-base">*</span>}
                  </p>
                  <textarea
                    id="aboutMe"
                    name="aboutMe"
                    placeholder={isMediator ? "Tell us about your experience as a mediator..." : "Tell us about yourself (minimum 30 words)"}
                    required={!isMediator}
                    value={formData.aboutMe}
                    onChange={handleInputChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-14 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                  ></textarea>
                </label>
              </div>
              {!isMediator && (
                <div className="flex flex-col sm:flex-row max-w-[1200px] flex-wrap items-end gap-3 px-3 py-1">
                  <label className="flex flex-col min-w-36 flex-1">
                    <p className="text-gray-700 text-xs font-medium leading-normal pb-1">What I'm Looking For <span className="text-red-600 font-bold text-base">*</span></p>
                    <textarea
                      id="lookingFor"
                      name="lookingFor"
                      placeholder="Describe what you're looking for in a partner"
                      required
                      value={formData.lookingFor}
                      onChange={handleInputChange}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-orange-300 border border-gray-200 bg-white focus:border-orange-400 h-14 placeholder:text-gray-400 p-[12px] text-sm font-normal leading-normal"
                    ></textarea>
                  </label>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex flex-wrap items-end gap-3 px-3 py-2">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="flex min-w-28 max-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-7 px-3 bg-white/20 text-gray-800 text-xs font-bold leading-normal tracking-[0.015em] hover:bg-white/30"
                >
                  <span className="truncate">Save Draft</span>
                </button>
                <button
                  type="submit"
                  className="flex min-w-28 max-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-7 px-3 bg-[#e91e63] text-white text-xs font-bold leading-normal tracking-[0.015em] hover:bg-[#d81b60]"
                >
                  <span className="truncate">Submit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = ({ onProfileComplete, isMediator: externalIsMediator }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isMediator, setIsMediator] = useState(externalIsMediator || false);
  
  const handleLoginSuccess = (mediatorStatus) => {
    setIsMediator(mediatorStatus);
    // Always show profile page after login, regardless of mediator status
    setShowProfile(true);
  };

  const handleProfileComplete = () => {
    if (onProfileComplete) {
      onProfileComplete(isMediator);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-red-500 via-orange-500 to-red-600 group/design-root overflow-x-hidden" id="appContainer">
      {!showProfile ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ProfilePage onProfileComplete={handleProfileComplete} isMediator={isMediator} />
      )}
    </div>
  );
};

export default App;