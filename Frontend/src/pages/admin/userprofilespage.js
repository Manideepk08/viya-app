import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProfiles } from '../../data/mockdata';

// For demo: add a 'blocked' property to some profiles and a gender property
const profilesWithBlocked = mockProfiles.map((p, i) => ({
  ...p,
  blocked: i % 3 === 0,
  gender: i % 2 === 0 ? 'female' : 'male', // alternate genders for demo
}));

const NAV_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Unblocked', value: 'unblocked' },
  { label: 'Match Fixed', value: 'matchfixed' },
];

// Add mock mediators for match fixing
const mockMediators = [
  { id: 1, name: 'Sunita Rao', joined: '2022-11-05', status: 'verified', completedMatches: 12, avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 2, name: 'Vikram Patel', joined: '2023-03-10', status: 'pending', completedMatches: 0, avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
];

export default function UserProfilesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [matchFixedPairs, setMatchFixedPairs] = useState([]); // [{maleId, femaleId, mediatorId}]
  const [messageModal, setMessageModal] = useState({ open: false, profile: null, text: '' });
  const [sentMessages, setSentMessages] = useState([]); // {profileId, text}
  const navigate = useNavigate();

  // Helper: get all locked profile ids
  const lockedProfileIds = matchFixedPairs.reduce((arr, pair) => arr.concat([pair.maleId, pair.femaleId]), []);

  let filtered = profilesWithBlocked.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filter === 'blocked') filtered = filtered.filter(u => u.blocked);
  if (filter === 'unblocked') filtered = filtered.filter(u => !u.blocked);
  if (filter === 'matchfixed') filtered = filtered.filter(u => lockedProfileIds.includes(u.id));

  // Message handlers
  const openMessageModal = (profile) => setMessageModal({ open: true, profile, text: '' });
  const closeMessageModal = () => setMessageModal({ open: false, profile: null, text: '' });
  const handleSendMessage = () => {
    setSentMessages(prev => [...prev, { profileId: messageModal.profile.id, text: messageModal.text }]);
    closeMessageModal();
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => navigate('/admin-dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24 }} title="Back to Dashboard">
        <span style={{ fontSize: 28, color: '#e65100' }}>←</span>
      </button>
      <h2 style={{ fontSize: 28, color: '#e65100', marginBottom: 24 }}>All User Profiles</h2>
      {/* Navbar for filter options */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {NAV_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: filter === opt.value ? '2px solid #e65100' : '1px solid #ccc',
              background: filter === opt.value ? '#ffe0b2' : '#fff',
              color: filter === opt.value ? '#e65100' : '#23243a',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: filter === opt.value ? '0 2px 8px #ffd70022' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {/* Removed match fixing UI for admin */}
      {/* Only show search bar if not matchfixed filter */}
      {filter !== 'matchfixed' && (
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: 10, borderRadius: 8, border: '1px solid #ccc', marginBottom: 24, width: 300
          }}
        />
      )}
      {/* Show combined match fixed cards if filter is matchfixed */}
      {filter === 'matchfixed' ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          {matchFixedPairs.length > 0 ? matchFixedPairs.map((pair, idx) => {
            const male = profilesWithBlocked.find(p => p.id === pair.maleId);
            const female = profilesWithBlocked.find(p => p.id === pair.femaleId);
            const mediator = mockMediators.find(m => m.id === pair.mediatorId) || mockMediators[0];
            if (!male || !female) return null;
            return (
              <div key={idx} style={{ background: '#fff3e0', borderRadius: 18, boxShadow: '0 2px 8px #ffd70022', padding: 28, minWidth: 520, display: 'flex', alignItems: 'center', gap: 32 }}>
                {/* Male profile */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <img src={male.photos[0]} alt={male.name} style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #e65100', objectFit: 'cover', marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{male.name}, {male.age}</div>
                  <div style={{ fontSize: 15, color: '#b26a00' }}>{male.city}, {male.state}</div>
                  <div style={{ fontSize: 14, color: '#888' }}>{male.education} | {male.job}</div>
                  <div style={{ fontSize: 14, color: '#388e3c' }}>Gotra: {male.gotra}</div>
                </div>
                {/* Female profile */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <img src={female.photos[0]} alt={female.name} style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #e65100', objectFit: 'cover', marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{female.name}, {female.age}</div>
                  <div style={{ fontSize: 15, color: '#b26a00' }}>{female.city}, {female.state}</div>
                  <div style={{ fontSize: 14, color: '#888' }}>{female.education} | {female.job}</div>
                  <div style={{ fontSize: 14, color: '#388e3c' }}>Gotra: {female.gotra}</div>
                </div>
                {/* Mediator details */}
                <div style={{ minWidth: 140, textAlign: 'center', borderLeft: '2px dashed #e65100', paddingLeft: 18 }}>
                  <img src={mediator.avatar} alt={mediator.name} style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #e65100', objectFit: 'cover', marginBottom: 6 }} />
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{mediator.name}</div>
                  <div style={{ fontSize: 13, color: '#b26a00' }}>Mediator</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Joined: {mediator.joined}</div>
                </div>
              </div>
            );
          }) : <div>No matches fixed yet.</div>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {filtered.length > 0 ? filtered.map(user => {
            const isLocked = lockedProfileIds.includes(user.id);
            return (
              <div key={user.id} style={{
                background: '#fff3e0', borderRadius: 16, padding: 20, minWidth: 260, color: '#23243a', boxShadow: '0 2px 8px #ffd70022', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: user.blocked ? 0.6 : 1
              }}>
                <img src={user.photos[0]} alt={user.name} style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 12, border: user.blocked ? '2px solid #b71c1c' : '2px solid #e65100', objectFit: 'cover' }} />
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{user.name}, {user.age}</div>
                <div style={{ fontSize: 15, color: '#b26a00', marginBottom: 4 }}>{user.city}, {user.state}</div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>{user.education} | {user.job}</div>
                <div style={{ fontSize: 14, color: '#388e3c', marginBottom: 4 }}>Gotra: {user.gotra}</div>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 4, textAlign: 'center' }}>{user.bio}</div>
                {user.blocked && <div style={{ color: '#b71c1c', fontWeight: 700, marginTop: 8 }}>Blocked</div>}
                {isLocked && (
                  <div style={{ color: '#388e3c', fontWeight: 700, marginTop: 8, fontSize: 18 }}>
                    <span role="img" aria-label="locked">🔒</span> Match Fixed
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    onClick={() => openMessageModal(user)}
                    disabled={isLocked}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: isLocked ? '#ccc' : '#ff9800',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      opacity: isLocked ? 0.6 : 1,
                    }}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            );
          }) : <div>No users found.</div>}
        </div>
      )}
      {/* Message Modal */}
      {messageModal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 2px 16px #ffd70055', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ color: '#e65100', fontSize: 22, marginBottom: 18 }}>Send Message to {messageModal.profile?.name}</h3>
            <textarea
              value={messageModal.text}
              onChange={e => setMessageModal(m => ({ ...m, text: e.target.value }))}
              rows={4}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginBottom: 18, fontSize: 16 }}
              placeholder="Type your message..."
            />
            <div style={{ display: 'flex', gap: 16 }}>
              <button
                onClick={handleSendMessage}
                disabled={!messageModal.text.trim()}
                style={{
                  padding: '8px 24px', borderRadius: 8, border: 'none', background: '#ff9800', color: '#fff', fontWeight: 700, fontSize: 16, cursor: !messageModal.text.trim() ? 'not-allowed' : 'pointer', opacity: !messageModal.text.trim() ? 0.6 : 1
                }}
              >
                Send
              </button>
              <button
                onClick={closeMessageModal}
                style={{ padding: '8px 24px', borderRadius: 8, border: 'none', background: '#ccc', color: '#23243a', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 