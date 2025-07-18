import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import '@fontsource/poppins';
import '@fontsource/nunito';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faHandshake, faMoneyBillWave, faTachometerAlt, faUser, faChartLine, faScissors, faBook, faChartPie, faEdit, faArrowUp, faArrowDown, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import UserProfilesPage from './userprofilespage';
import MediatorProfilesPage from './MediatorProfilesPage';
import RevenueProfilesPage from './revenueprofilespage';
import { mockProfiles } from '../../data/mockdata';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Move mockMediators here so it's available for useState
const mockMediators = [
  { id: 1, name: 'Sunita Rao', joined: '2022-11-05', status: 'pending', completedMatches: 12, avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 2, name: 'Vikram Patel', joined: '2023-03-10', status: 'pending', completedMatches: 0, avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
];

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [mediators, setMediators] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: '2 new mediator applications pending', icon: '🧑‍💼', unread: true },
    { id: 2, text: '5 new user signups today', icon: '👤', unread: true },
    { id: 3, text: 'System update scheduled for tonight', icon: '🛠️', unread: false },
  ]);
  const [showMenu, setShowMenu] = useState(false);
  const [modal, setModal] = useState(null); // 'about' | 'fake' | 'edit' | 'approval' | null
  const [showRatioModal, setShowRatioModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showMatchRatioModal, setShowMatchRatioModal] = useState(false);
  const [showMediatorStatusModal, setShowMediatorStatusModal] = useState(false);
  const [showAppEditModal, setShowAppEditModal] = useState(false);
  const [showGrowthModal, setShowGrowthModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState(0);
  const analyticsOptions = [
    { label: 'User Ratios', icon: faChartPie },
    { label: 'Match Success', icon: faChartPie },
    { label: 'Growth', icon: faChartLine },
  ];
  const navigate = useNavigate();
  const [verificationTab, setVerificationTab] = useState('approval'); // 'approval' | 'verified' | 'rejected'
  const [userVerifications, setUserVerifications] = useState(
    mockProfiles.map((p, i) => ({ ...p, verification: i % 3 === 1 ? 'pending' : (i % 3 === 0 ? 'verified' : 'rejected') }))
  );
  const [mediatorVerifications, setMediatorVerifications] = useState(
    mockMediators.map((m, i) => ({ ...m, verification: i % 2 === 0 ? 'pending' : 'verified' }))
  );
  const [mediaType, setMediaType] = useState('none');
  const [messageType, setMessageType] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageMedia, setMessageMedia] = useState(null);
  const [sendStatus, setSendStatus] = useState(null);

  const sidebarItems = [
    { label: 'Dashboard', icon: faUser, tab: 'dashboard' },
    { label: 'Mediators', icon: faHandshake, tab: 'mediators' },
    { label: 'Verification', icon: faCheckCircle, tab: 'verification' },
    { label: 'Transactions', icon: faMoneyBillWave, tab: 'transactions' },
    { label: 'Reports', icon: faBook, tab: 'reports' },
  ];

  // Mock data - would come from API in real app
  const loadData = (tab) => {
    switch(tab) {
      case 'users':
        setUsers([
          { id: 1, name: 'User A', joined: '2023-01-15', status: 'active' },
          { id: 2, name: 'User B', joined: '2023-02-20', status: 'pending' }
        ]);
        break;
      case 'mediators':
        setMediators([
          { id: 1, name: 'Mediator X', joined: '2022-11-05', status: 'verified', completedMatches: 12 },
          { id: 2, name: 'Mediator Y', joined: '2023-03-10', status: 'pending', completedMatches: 0 }
        ]);
        break;
      case 'transactions':
        setTransactions([
          { id: 1, date: '2023-06-01', amount: 199, user: 'User A', type: 'interest' },
          { id: 2, date: '2023-06-02', amount: 3500, user: 'Mediator X', type: 'commission' },
          { id: 3, date: '2023-06-05', amount: 499, user: 'User B', type: 'profile upgrade' },
          { id: 4, date: '2023-06-07', amount: 1200, user: 'User C', type: 'premium membership' }
        ]);
        break;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    loadData(tab);
  };

  const verifyMediator = (id) => {
    // API call to verify mediator
    setMediators(mediators.map(m => 
      m.id === id ? {...m, status: 'verified'} : m
    ));
  };

  // Navbar logout handler
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      alert('Logged out!');
      navigate('/');
    }
  };

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
    // Optionally, mark all as read when opened
    setNotifications((prev) => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMenuClick = () => setShowMenu((prev) => !prev);
  const handleMenuOption = (type) => {
    setModal(type);
    setShowMenu(false);
  };
  const closeModal = () => setModal(null);

  // Calculate dynamic user ratios
  const fallbackMale = 728, fallbackFemale = 520, fallbackMediator = 47;
  const hasUserData = users.length > 0;
  const hasMediatorData = mediators.length > 0;
  const maleCount = hasUserData ? users.filter(u => u.gender === 'male').length : fallbackMale;
  const femaleCount = hasUserData ? users.filter(u => u.gender === 'female').length : fallbackFemale;
  const mediatorCount = hasMediatorData ? mediators.length : fallbackMediator;
  const total = maleCount + femaleCount + mediatorCount;
  const malePercent = total ? ((maleCount / total) * 100).toFixed(1) : '0.0';
  const femalePercent = total ? ((femaleCount / total) * 100).toFixed(1) : '0.0';
  const mediatorPercent = total ? ((mediatorCount / total) * 100).toFixed(1) : '0.0';

  // Pie chart angles
  const maleAngle = (maleCount / total) * 360;
  const femaleAngle = (femaleCount / total) * 360;
  const mediatorAngle = (mediatorCount / total) * 360;

  // Helper to describe SVG arc
  function describeArc(cx, cy, r, startAngle, endAngle, color) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = [
      'M', cx, cy,
      'L', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
    return <path d={d} fill={color} key={color} />;
  }
  function polarToCartesian(cx, cy, r, angle) {
    const rad = (angle - 90) * Math.PI / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  }

  // Mock data for year-to-year user growth and revenue
  const userGrowthData = [
    { year: '2020', users: 400 },
    { year: '2021', users: 700 },
    { year: '2022', users: 950 },
    { year: '2023', users: 1248 },
    { year: '2024', users: 1500 },
  ];
  const revenueData = [
    { year: '2020', revenue: 50000 },
    { year: '2021', revenue: 120000 },
    { year: '2022', revenue: 180000 },
    { year: '2023', revenue: 249600 },
    { year: '2024', revenue: 320000 },
  ];

  const handleSendMessage = async (target) => {
    setSendStatus(null);
    if (!messageType || !messageText) {
      setSendStatus({ success: false, message: 'Please fill in type and message.' });
      return;
    }
  
    // Prepare the payload
    const payload = {
      title: messageType,
      message: messageText,
      mediaType,
      mediaUrl: '', // You can add logic to upload and get a URL if needed
      type: messageType,
      recipientType: target === 'all' ? 'all' : target
    };
  
    try {
      // Send to backend
      await fetch('http://localhost:5000/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSendStatus({ success: true, message: `Message sent to ${target === 'all' ? 'users and mediators' : target}!` });
      setTimeout(() => {
        setShowAppEditModal(false);
        setMessageType('');
        setMessageText('');
        setMediaType('none');
        setMessageMedia(null);
        setSendStatus(null);
      }, 1500);
    } catch (err) {
      setSendStatus({ success: false, message: 'Failed to send message.' });
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions') {
      loadData('transactions');
    }
  }, [activeTab]);

  return (
    <Routes>
      <Route path="/" element={
        <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #fff3e0 0%, #ffe0b2 60%, #ff9800 100%)', display: 'flex', fontFamily: 'Poppins, Nunito, sans-serif' }}>
          {/* Sidebar */}
          <aside style={{ width: 220, background: '#fff3e0', borderTopLeftRadius: 18, borderBottomLeftRadius: 18, boxShadow: '4px 0 32px #ffe0b2', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0 0 0', color: '#23243a' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36, marginLeft: 18 }}>
              <img src="/logo_nobg.png" alt="Viya Logo" style={{ width: 60, height: 60, marginRight: 16, borderRadius: 12, background: '#fff' }} />
              <span style={{ color: '#b26a00', fontWeight: 800, fontSize: 22, letterSpacing: 1, fontFamily: 'Poppins, Nunito, sans-serif', textShadow: '0 2px 8px #ffe0b2' }}>Viya Matrimony</span>
            </div>
            <nav style={{ width: '100%' }}>
              {sidebarItems.map((item) => (
                <button
                  key={item.tab}
                  style={{
                    display: 'flex', alignItems: 'center', width: '100%', background: activeTab === item.tab ? 'linear-gradient(90deg, #ffd700 0%, #ff9800 100%)' : 'none', border: 'none', color: activeTab === item.tab ? '#23243a' : '#b26a00', fontSize: 17, fontWeight: 600, padding: '16px 32px', marginBottom: 4, cursor: 'pointer', borderRadius: 12, transition: 'background 0.2s, color 0.2s',
                    boxShadow: activeTab === item.tab ? '0 2px 8px #ffd70055' : 'none',
                  }}
                  onClick={() => setActiveTab(item.tab)}
                >
                  <FontAwesomeIcon icon={item.icon} style={{ marginRight: 16, fontSize: 20, opacity: activeTab === item.tab ? 1 : 0.6, color: activeTab === item.tab ? '#23243a' : '#b26a00' }} />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
          {/* Main Content */}
          <div style={{ flex: 3, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{ width: '100%', height: 70, background: 'linear-gradient(90deg, #ffd700 0%, #ff9800 100%)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 40px', borderTopLeftRadius: 18, borderTopRightRadius: 18, boxShadow: '0 2px 8px #ffd70055', marginBottom: 16 }}>
              {/* Notification Bell */}
              <button
                onClick={handleBellClick}
                className="admin-navbar-bell"
                style={{ background: 'none', border: 'none', position: 'relative', fontSize: 28, marginRight: 24, color: '#fff', cursor: 'pointer' }}
                title="Notifications"
              >
                <span role="img" aria-label="bell">🔔</span>
                {unreadCount > 0 && (
                  <span className="admin-navbar-bell-dot" style={{ position: 'absolute', top: 7, right: 7, width: 12, height: 12, background: '#e53935', borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 4px #e53935' }}></span>
                )}
              </button>
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="admin-notification-dropdown" style={{ position: 'absolute', top: 70, right: 40, width: 340, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.13)', zIndex: 100, padding: 0 }}>
                  <div className="admin-notification-dropdown-header" style={{ fontWeight: 700, color: '#ff9800', fontSize: '1.1rem', padding: '16px 18px 10px 18px', borderBottom: '1px solid #ffe0b2' }}>Notifications</div>
                  {notifications.length === 0 && (
                    <div className="admin-notification-empty" style={{ padding: 18, color: '#aaa', textAlign: 'center', fontSize: '1rem' }}>No notifications</div>
                  )}
                  {notifications.map(n => (
                    <div key={n.id} className="admin-notification-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', fontSize: '1rem', color: n.unread ? '#e65100' : '#444', background: n.unread ? '#fff8e1' : 'none', borderBottom: '1px solid #f3f3f3' }}>
                      <span className="admin-notification-item-icon" style={{ fontSize: '1.3rem' }}>{n.icon}</span>
                      <span className="admin-notification-item-text" style={{ flex: 1 }}>{n.text}</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={handleLogout} style={{ background: 'linear-gradient(90deg, #ff9800 60%, #ff5722 100%)', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(255,152,0,0.10)', transition: 'background 0.2s, color 0.2s' }}>Logout</button>
            </header>
            {/* Cards Section */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '40px 40px 0 40px' }}>
              {/* Dashboard Features Restored */}
              <div style={{ width: '100%' }}>
                {/* Dashboard Cards and Content */}
                {activeTab === 'dashboard' && (
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                      <div style={{ flex: 1, background: 'linear-gradient(120deg, #fff3e0 80%, #ffe0b2 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(255,152,0,0.10)', padding: '24px 18px', textAlign: 'center', cursor: 'pointer', position: 'relative' }} onClick={() => navigate('users')}>
                        <h3 style={{ fontSize: 18, color: '#e65100', marginBottom: 8 }}>Total Users</h3>
                        <p style={{ fontSize: 32, fontWeight: 700, color: '#ff9800', margin: 0 }}>1,248</p>
                        <small style={{ color: '#888', fontSize: 15 }}>+12% this month</small>
                        <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#e65100', cursor: 'pointer' }} title="Go to Users">→</button>
                      </div>
                      <div style={{ flex: 1, background: 'linear-gradient(120deg, #fff3e0 80%, #ffe0b2 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(255,152,0,0.10)', padding: '24px 18px', textAlign: 'center', cursor: 'pointer', position: 'relative' }} onClick={() => navigate('mediators')}>
                        <h3 style={{ fontSize: 18, color: '#e65100', marginBottom: 8 }}>Active Mediators</h3>
                        <p style={{ fontSize: 32, fontWeight: 700, color: '#ff9800', margin: 0 }}>47</p>
                        <small style={{ color: '#888', fontSize: 15 }}>8 pending verification</small>
                        <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#e65100', cursor: 'pointer' }} title="Go to Mediators">→</button>
                      </div>
                      <div style={{ flex: 1, background: 'linear-gradient(120deg, #fff3e0 80%, #ffe0b2 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(255,152,0,0.10)', padding: '24px 18px', textAlign: 'center', cursor: 'pointer', position: 'relative' }} onClick={() => navigate('revenue')}>
                        <h3 style={{ fontSize: 18, color: '#e65100', marginBottom: 8 }}>Monthly Revenue</h3>
                        <p style={{ fontSize: 32, fontWeight: 700, color: '#ff9800', margin: 0 }}>₹2,49,600</p>
                        <small style={{ color: '#888', fontSize: 15 }}>30% from commissions</small>
                        <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#e65100', cursor: 'pointer' }} title="Go to Revenue">→</button>
                      </div>
                    </div>
                    <div style={{ marginTop: 24 }}>
                      <h3 style={{ fontSize: 20, color: '#b26a00', marginBottom: 10 }}>Recent Activity</h3>
                      <ul style={{ listStyle: 'disc inside', color: '#b26a00', paddingLeft: 18 }}>
                        <li>5 new user signups today</li>
                        <li>3 matches completed yesterday</li>
                        <li>2 mediator applications pending</li>
                        <li>System update scheduled for tonight</li>
                      </ul>
                      {/* Pie Chart for User Ratios */}
                      <div style={{ marginTop: 40, width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff3e0', borderRadius: 16, padding: 32 }}>
                        <h4 style={{ color: '#e65100', fontSize: 28, fontWeight: 700, marginBottom: 18, textAlign: 'center' }}>User Ratios</h4>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                          <svg width="220" height="220" viewBox="0 0 32 32">
                            {/* Male */}
                            {describeArc(16, 16, 16, 0, maleAngle, '#ff9800')}
                            {/* Female */}
                            {describeArc(16, 16, 16, maleAngle, maleAngle + femaleAngle, '#e65100')}
                            {/* Mediator */}
                            {describeArc(16, 16, 16, maleAngle + femaleAngle, 360, '#388e3c')}
                          </svg>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 28, flexWrap: 'wrap', width: '100%' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#ff9800', display: 'inline-block' }}></span>
                              <span style={{ color: '#e65100', fontWeight: 700, fontSize: 18 }}>Male</span>
                            </span>
                            <span style={{ color: '#b26a00', fontSize: 16, marginTop: 4 }}>{maleCount} ({malePercent}%)</span>
                            <span style={{ color: '#ff9800', fontSize: 14, marginTop: 2 }}>Active male users registered on the platform.</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#e65100', display: 'inline-block' }}></span>
                              <span style={{ color: '#e65100', fontWeight: 700, fontSize: 18 }}>Female</span>
                            </span>
                            <span style={{ color: '#b26a00', fontSize: 16, marginTop: 4 }}>{femaleCount} ({femalePercent}%)</span>
                            <span style={{ color: '#e65100', fontSize: 14, marginTop: 2 }}>Active female users registered on the platform.</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#388e3c', display: 'inline-block' }}></span>
                              <span style={{ color: '#388e3c', fontWeight: 700, fontSize: 18 }}>Mediator</span>
                            </span>
                            <span style={{ color: '#388e3c', fontSize: 16, marginTop: 4 }}>{mediatorCount} ({mediatorPercent}%)</span>
                            <span style={{ color: '#388e3c', fontSize: 14, marginTop: 2 }}>Verified mediators helping users connect and match.</span>
                          </div>
                        </div>
                        {/* Growth Graph */}
                        <div style={{ width: '100%', maxWidth: 600, margin: '40px auto 0', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #ffd70022', padding: 24 }}>
                          <h4 style={{ color: '#e65100', fontSize: 22, fontWeight: 700, marginBottom: 18, textAlign: 'center' }}>User Growth (Yearly)</h4>
                          <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="users" stroke="#ff9800" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        {/* Revenue Graph */}
                        <div style={{ width: '100%', maxWidth: 600, margin: '40px auto 0', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #ffd70022', padding: 24 }}>
                          <h4 style={{ color: '#e65100', fontSize: 22, fontWeight: 700, marginBottom: 18, textAlign: 'center' }}>Revenue (Yearly)</h4>
                          <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip formatter={value => `₹${value.toLocaleString()}`} />
                              <Legend />
                              <Bar dataKey="revenue" fill="#e65100" barSize={40} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'users' && (
                  <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 18, boxShadow: '0 2px 8px #ffd70022', padding: 24 }}>
                    {/* Example user profiles */}
                    {[
                      { id: 1, name: 'Amit Sharma', joined: '2023-01-15', status: 'active', gender: 'male', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                      { id: 2, name: 'Priya Singh', joined: '2023-02-20', status: 'pending', gender: 'female', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                      { id: 3, name: 'Rahul Verma', joined: '2023-03-10', status: 'active', gender: 'male', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
                    ].map(user => (
                      <div key={user.id} style={{ background: '#23243a', borderRadius: 16, boxShadow: '0 2px 8px #8f94fb33', padding: 20, minWidth: 220, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={user.avatar} alt={user.name} style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 12, border: '2px solid #7b7be6', objectFit: 'cover' }} />
                        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{user.name}</div>
                        <div style={{ fontSize: 14, color: '#bbb', marginBottom: 4 }}>Joined: {user.joined}</div>
                        <span style={{ fontSize: 13, color: user.status === 'active' ? '#4caf50' : '#ff9800', fontWeight: 600, background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '2px 12px' }}>{user.status}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'mediators' && (
                  <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 18, boxShadow: '0 2px 8px #ffd70022', padding: 24 }}>
                    {/* Example mediator profiles */}
                    {[
                      { id: 1, name: 'Sunita Rao', joined: '2022-11-05', status: 'verified', completedMatches: 12, avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
                      { id: 2, name: 'Vikram Patel', joined: '2023-03-10', status: 'pending', completedMatches: 0, avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
                    ].map(mediator => (
                      <div key={mediator.id} style={{ background: '#23243a', borderRadius: 16, boxShadow: '0 2px 8px #8f94fb33', padding: 20, minWidth: 220, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={mediator.avatar} alt={mediator.name} style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 12, border: '2px solid #7b7be6', objectFit: 'cover' }} />
                        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{mediator.name}</div>
                        <div style={{ fontSize: 14, color: '#bbb', marginBottom: 4 }}>Joined: {mediator.joined}</div>
                        <span style={{ fontSize: 13, color: mediator.status === 'verified' ? '#4caf50' : '#ff9800', fontWeight: 600, background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '2px 12px', marginBottom: 4 }}>{mediator.status}</span>
                        <div style={{ fontSize: 13, color: '#bbb', marginTop: 4 }}>Matches: <span style={{ color: '#fff', fontWeight: 600 }}>{mediator.completedMatches}</span></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'transactions' && (
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 18, boxShadow: '0 2px 8px #ffd70022', padding: 24 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 18, background: 'none' }}>
                      <thead>
                        <tr>
                          <th style={{ background: 'linear-gradient(90deg, #ffe0b2 60%, #ffd700 100%)', color: '#e65100', fontWeight: 700, padding: '12px 8px', borderBottom: '2px solid #ff9800' }}>ID</th>
                          <th style={{ background: 'linear-gradient(90deg, #ffe0b2 60%, #ffd700 100%)', color: '#e65100', fontWeight: 700, padding: '12px 8px', borderBottom: '2px solid #ff9800' }}>Date</th>
                          <th style={{ background: 'linear-gradient(90deg, #ffe0b2 60%, #ffd700 100%)', color: '#e65100', fontWeight: 700, padding: '12px 8px', borderBottom: '2px solid #ff9800' }}>Amount</th>
                          <th style={{ background: 'linear-gradient(90deg, #ffe0b2 60%, #ffd700 100%)', color: '#e65100', fontWeight: 700, padding: '12px 8px', borderBottom: '2px solid #ff9800' }}>User</th>
                          <th style={{ background: 'linear-gradient(90deg, #ffe0b2 60%, #ffd700 100%)', color: '#e65100', fontWeight: 700, padding: '12px 8px', borderBottom: '2px solid #ff9800' }}>Type</th>
                          <th style={{ background: 'linear-gradient(90deg, #ffe0b2 60%, #ffd700 100%)', color: '#e65100', fontWeight: 700, padding: '12px 8px', borderBottom: '2px solid #ff9800' }}>Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(txn => (
                          <tr key={txn.id}>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #f3f3f3', textAlign: 'center', color: '#23243a' }}>{txn.id}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #f3f3f3', textAlign: 'center', color: '#23243a' }}>{txn.date}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #f3f3f3', textAlign: 'center', color: '#23243a' }}>₹{txn.amount}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #f3f3f3', textAlign: 'center', color: '#23243a' }}>{txn.user}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #f3f3f3', textAlign: 'center', color: '#23243a' }}>{txn.type}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #f3f3f3', textAlign: 'center' }}>
                              <button className="btn btn-sm">Download</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {activeTab === 'reports' && (
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 18, boxShadow: '0 2px 8px #ffd70022', padding: 24, color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 600 }}>
                    Reports section coming soon!
                  </div>
                )}
                {activeTab === 'verification' && (
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 18, boxShadow: '0 2px 8px #ffd70022', padding: 24 }}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                      <button
                        onClick={() => setVerificationTab('approval')}
                        style={{
                          padding: '8px 24px', borderRadius: 8, border: verificationTab === 'approval' ? '2px solid #ff9800' : '1px solid #ccc', background: verificationTab === 'approval' ? '#ffe0b2' : '#fff', color: verificationTab === 'approval' ? '#ff9800' : '#23243a', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: verificationTab === 'approval' ? '0 2px 8px #ffd70022' : 'none', transition: 'all 0.2s',
                        }}
                      >Approval Requests</button>
                      <button
                        onClick={() => setVerificationTab('verified')}
                        style={{
                          padding: '8px 24px', borderRadius: 8, border: verificationTab === 'verified' ? '2px solid #388e3c' : '1px solid #ccc', background: verificationTab === 'verified' ? '#c8e6c9' : '#fff', color: verificationTab === 'verified' ? '#388e3c' : '#23243a', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: verificationTab === 'verified' ? '0 2px 8px #388e3c22' : 'none', transition: 'all 0.2s',
                        }}
                      >Verified</button>
                      <button
                        onClick={() => setVerificationTab('rejected')}
                        style={{
                          padding: '8px 24px', borderRadius: 8, border: verificationTab === 'rejected' ? '2px solid #b71c1c' : '1px solid #ccc', background: verificationTab === 'rejected' ? '#ffcdd2' : '#fff', color: verificationTab === 'rejected' ? '#b71c1c' : '#23243a', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: verificationTab === 'rejected' ? '0 2px 8px #b71c1c22' : 'none', transition: 'all 0.2s',
                        }}
                      >Rejected</button>
                    </div>
                    {/* Approval Requests Tab */}
                    {verificationTab === 'approval' && (
                      <>
                        <h3 style={{ color: '#e65100', fontSize: 22, marginBottom: 18 }}>Approval Requests - User Profiles</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
                          {userVerifications.filter(u => u.verification === 'pending').map(user => (
                            <div key={user.id} style={{ background: '#fff3e0', borderRadius: 16, padding: 20, minWidth: 260, color: '#23243a', boxShadow: '0 2px 8px #ffd70022', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={user.photos[0]} alt={user.name} style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 12, border: '2px solid #e65100', objectFit: 'cover' }} />
                              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{user.name}, {user.age}</div>
                              <div style={{ fontSize: 15, color: '#b26a00', marginBottom: 4 }}>{user.city}, {user.state}</div>
                              <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>{user.education} | {user.job}</div>
                              <div style={{ fontSize: 14, color: '#388e3c', marginBottom: 4 }}>Gotra: {user.gotra}</div>
                              <div style={{ fontSize: 13, color: '#555', marginBottom: 4, textAlign: 'center' }}>{user.bio}</div>
                              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                <button onClick={() => setUserVerifications(vs => vs.map(u => u.id === user.id ? { ...u, verification: 'verified' } : u))} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#388e3c', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Approve</button>
                                <button onClick={() => setUserVerifications(vs => vs.map(u => u.id === user.id ? { ...u, verification: 'rejected' } : u))} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#b71c1c', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Reject</button>
                              </div>
                            </div>
                          ))}
                          {userVerifications.filter(u => u.verification === 'pending').length === 0 && <div>No approval requests for user profiles.</div>}
                        </div>
                        <h3 style={{ color: '#e65100', fontSize: 22, marginBottom: 18 }}>Approval Requests - Mediator Profiles</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                          {mediatorVerifications.filter(m => m.verification === 'pending').map(mediator => (
                            <div key={mediator.id} style={{ background: '#fff3e0', borderRadius: 16, padding: 20, minWidth: 220, color: '#23243a', boxShadow: '0 2px 8px #ffd70022', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={mediator.avatar} alt={mediator.name} style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 12, border: '2px solid #e65100', objectFit: 'cover' }} />
                              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{mediator.name}</div>
                              <div style={{ fontSize: 14, color: '#b26a00', marginBottom: 4 }}>Joined: {mediator.joined}</div>
                              <span style={{ fontSize: 13, color: '#888', fontWeight: 600, background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '2px 12px', marginBottom: 4 }}>{mediator.status}</span>
                              <div style={{ fontSize: 14, color: '#888' }}>Matches: {mediator.completedMatches}</div>
                              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                <button onClick={() => setMediatorVerifications(vs => vs.map(m => m.id === mediator.id ? { ...m, verification: 'verified' } : m))} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#388e3c', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Approve</button>
                                <button onClick={() => setMediatorVerifications(vs => vs.map(m => m.id === mediator.id ? { ...m, verification: 'rejected' } : m))} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#b71c1c', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Reject</button>
                              </div>
                            </div>
                          ))}
                          {mediatorVerifications.filter(m => m.verification === 'pending').length === 0 && <div>No approval requests for mediator profiles.</div>}
                        </div>
                      </>
                    )}
                    {/* Verified Tab */}
                    {verificationTab === 'verified' && (
                      <>
                        <h3 style={{ color: '#e65100', fontSize: 22, marginBottom: 18 }}>User Profiles</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
                          {userVerifications.filter(u => u.verification === 'verified').map(user => (
                            <div key={user.id} style={{ background: '#fff3e0', borderRadius: 16, padding: 20, minWidth: 260, color: '#23243a', boxShadow: '0 2px 8px #ffd70022', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={user.photos[0]} alt={user.name} style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 12, border: '2px solid #e65100', objectFit: 'cover' }} />
                              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{user.name}, {user.age}</div>
                              <div style={{ fontSize: 15, color: '#b26a00', marginBottom: 4 }}>{user.city}, {user.state}</div>
                              <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>{user.education} | {user.job}</div>
                              <div style={{ fontSize: 14, color: '#388e3c', marginBottom: 4 }}>Gotra: {user.gotra}</div>
                              <div style={{ fontSize: 13, color: '#555', marginBottom: 4, textAlign: 'center' }}>{user.bio}</div>
                            </div>
                          ))}
                          {userVerifications.filter(u => u.verification === 'verified').length === 0 && <div>No user profiles found.</div>}
                        </div>
                        <h3 style={{ color: '#e65100', fontSize: 22, marginBottom: 18 }}>Mediator Profiles</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                          {mediatorVerifications.filter(m => m.verification === 'verified').map(mediator => (
                            <div key={mediator.id} style={{ background: '#fff3e0', borderRadius: 16, padding: 20, minWidth: 220, color: '#23243a', boxShadow: '0 2px 8px #ffd70022', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={mediator.avatar} alt={mediator.name} style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 12, border: '2px solid #e65100', objectFit: 'cover' }} />
                              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{mediator.name}</div>
                              <div style={{ fontSize: 14, color: '#b26a00', marginBottom: 4 }}>Joined: {mediator.joined}</div>
                              <span style={{ fontSize: 13, color: '#888', fontWeight: 600, background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '2px 12px', marginBottom: 4 }}>{mediator.status}</span>
                              <div style={{ fontSize: 14, color: '#888' }}>Matches: {mediator.completedMatches}</div>
                            </div>
                          ))}
                          {mediatorVerifications.filter(m => m.verification === 'verified').length === 0 && <div>No mediator profiles found.</div>}
                        </div>
                      </>
                    )}
                    {/* Rejected Tab */}
                    {verificationTab === 'rejected' && (
                      <>
                        <h3 style={{ color: '#e65100', fontSize: 22, marginBottom: 18 }}>User Profiles</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
                          {userVerifications.filter(u => u.verification === 'rejected').map(user => (
                            <div key={user.id} style={{ background: '#fff3e0', borderRadius: 16, padding: 20, minWidth: 260, color: '#23243a', boxShadow: '0 2px 8px #ffd70022', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={user.photos[0]} alt={user.name} style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 12, border: '2px solid #e65100', objectFit: 'cover' }} />
                              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{user.name}, {user.age}</div>
                              <div style={{ fontSize: 15, color: '#b26a00', marginBottom: 4 }}>{user.city}, {user.state}</div>
                              <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>{user.education} | {user.job}</div>
                              <div style={{ fontSize: 14, color: '#388e3c', marginBottom: 4 }}>Gotra: {user.gotra}</div>
                              <div style={{ fontSize: 13, color: '#555', marginBottom: 4, textAlign: 'center' }}>{user.bio}</div>
                            </div>
                          ))}
                          {userVerifications.filter(u => u.verification === 'rejected').length === 0 && <div>No user profiles found.</div>}
                        </div>
                        <h3 style={{ color: '#e65100', fontSize: 22, marginBottom: 18 }}>Mediator Profiles</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                          {mediatorVerifications.filter(m => m.verification === 'rejected').map(mediator => (
                            <div key={mediator.id} style={{ background: '#fff3e0', borderRadius: 16, padding: 20, minWidth: 220, color: '#23243a', boxShadow: '0 2px 8px #ffd70022', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={mediator.avatar} alt={mediator.name} style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 12, border: '2px solid #e65100', objectFit: 'cover' }} />
                              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{mediator.name}</div>
                              <div style={{ fontSize: 14, color: '#b26a00', marginBottom: 4 }}>Joined: {mediator.joined}</div>
                              <span style={{ fontSize: 13, color: '#888', fontWeight: 600, background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '2px 12px', marginBottom: 4 }}>{mediator.status}</span>
                              <div style={{ fontSize: 14, color: '#888' }}>Matches: {mediator.completedMatches}</div>
                            </div>
                          ))}
                          {mediatorVerifications.filter(m => m.verification === 'rejected').length === 0 && <div>No mediator profiles found.</div>}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </main>
            <Outlet />
          </div>
          {/* Right Side Panel for Mediator Status and App Edit */}
          <div style={{ flex: 1, minWidth: 320, background: '#ffe0b2', borderTopRightRadius: 18, borderBottomRightRadius: 18, boxShadow: '-4px 0 32px #ffe0b2', padding: '32px 18px', display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Mediator Status Card */}
            <div style={{ background: '#23243a', borderRadius: 16, boxShadow: '0 2px 8px #8f94fb33', padding: 20, color: '#fff', marginBottom: 24 }}>
              <h2 style={{ color: '#ffd700', marginBottom: 18, fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>Mediator Verification Status</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {[
                  { name: 'Sunita Rao', status: 'verified' },
                  { name: 'Vikram Patel', status: 'pending' },
                ].map(m => (
                  <li key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <FontAwesomeIcon icon={m.status === 'verified' ? faCheckCircle : faTimesCircle} style={{ color: m.status === 'verified' ? '#4caf50' : '#ff9800', fontSize: 22 }} />
                    <span style={{ fontWeight: 600 }}>{m.name}</span>
                    <span style={{ color: m.status === 'verified' ? '#4caf50' : '#ff9800', fontWeight: 600, marginLeft: 8 }}>{m.status}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* App Edit Card */}
            <div style={{ background: '#23243a', borderRadius: 16, boxShadow: '0 2px 8px #8f94fb33', padding: 20, color: '#fff' }}>
              <h2 style={{ color: '#ff9800', marginBottom: 18, fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>Edit App Content</h2>
              <div style={{ color: '#bbb', fontSize: 18, marginTop: 24, textAlign: 'center' }}>
                <button
                  style={{
                    background: 'linear-gradient(90deg, #ff9800 60%, #ff5722 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 18,
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 32px',
                    cursor: 'pointer',
                    marginBottom: 18
                  }}
                  onClick={() => setShowAppEditModal(true)}
                >
                  Send Message to Users/Mediators
                </button>
                <div style={{ color: '#bbb', fontSize: 16, marginTop: 12 }}>
                  Here you can send announcements, ads, app anniversary wishes, success stories, or quotes with images to all users and mediators.
                </div>
              </div>
              {/* Modal for sending message */}
              {showAppEditModal && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{ background: '#fff', color: '#23243a', borderRadius: 16, padding: 32, minWidth: 380, maxWidth: 480, boxShadow: '0 8px 32px #ffd70055', position: 'relative' }}>
                    <button onClick={() => setShowAppEditModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#ff9800', cursor: 'pointer' }}>✕</button>
                    <h3 style={{ color: '#ff9800', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Send Message</h3>
                    <form onSubmit={e => e.preventDefault()}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 600 }}>Type:</label>
                        <select style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} value={messageType || ''} onChange={e => setMessageType(e.target.value)}>
                          <option value="">Select type</option>
                          <option value="announcement">Announcement</option>
                          <option value="ad">Ad</option>
                          <option value="anniversary">App Anniversary</option>
                          <option value="success">Success Story/Quote</option>
                          <option value="picture">Picture</option>
                          <option value="event">Event</option>
                          <option value="reminder">Reminder</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 600 }}>Message:</label>
                        <textarea style={{ width: '100%', minHeight: 60, padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} value={messageText || ''} onChange={e => setMessageText(e.target.value)} placeholder="Enter your message here..." />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 600 }}>Media Type:</label>
                        <select style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} value={mediaType} onChange={e => { setMediaType(e.target.value); setMessageMedia(null); }}>
                          <option value="none">None</option>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      {mediaType === 'image' && (
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ fontWeight: 600 }}>Image:</label>
                          <input type="file" accept="image/*" onChange={e => setMessageMedia(e.target.files[0])} style={{ marginTop: 4 }} />
                          {messageMedia && <div style={{ marginTop: 8 }}><img src={URL.createObjectURL(messageMedia)} alt="preview" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8 }} /></div>}
                        </div>
                      )}
                      {mediaType === 'video' && (
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ fontWeight: 600 }}>Video:</label>
                          <input type="file" accept="video/*" onChange={e => setMessageMedia(e.target.files[0])} style={{ marginTop: 4 }} />
                          {messageMedia && <div style={{ marginTop: 8 }}><video src={URL.createObjectURL(messageMedia)} controls style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8 }} /></div>}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
                        <button type="button" style={{ background: '#ff9800', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }} onClick={() => handleSendMessage('users')}>Send to Users</button>
                        <button type="button" style={{ background: '#388e3c', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }} onClick={() => handleSendMessage('mediators')}>Send to Mediators</button>
                        <button type="button" style={{ background: '#23243a', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }} onClick={() => handleSendMessage('all')}>Send to Both</button>
                      </div>
                      {sendStatus && <div style={{ marginTop: 18, color: sendStatus.success ? '#388e3c' : '#b71c1c', fontWeight: 600 }}>{sendStatus.message}</div>}
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      } />
      <Route path="users" element={<UserProfilesPage />} />
      <Route path="mediators" element={<MediatorProfilesPage />} />
      <Route path="revenue" element={<RevenueProfilesPage />} />
    </Routes>
  );
};

export default AdminDashboard;