import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockMediators = [
  { id: 1, name: 'Sunita Rao', joined: '2022-11-05', status: 'verified', completedMatches: 12, avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 2, name: 'Vikram Patel', joined: '2023-03-10', status: 'pending', completedMatches: 0, avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
];

export default function MediatorProfilesPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const filtered = mockMediators.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => navigate('/admin-dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24 }} title="Back to Dashboard">
        <span style={{ fontSize: 28, color: '#e65100' }}>←</span>
      </button>
      <h2 style={{ fontSize: 28, color: '#e65100', marginBottom: 24 }}>Mediator Profiles</h2>
      <input
        type="text"
        placeholder="Search mediators..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          padding: 10, borderRadius: 8, border: '1px solid #ccc', marginBottom: 24, width: 300
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {filtered.map(mediator => (
          <div key={mediator.id} style={{
            background: '#fff3e0', borderRadius: 16, padding: 20, minWidth: 220, color: '#23243a', boxShadow: '0 2px 8px #ffd70022', display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <img src={mediator.avatar} alt={mediator.name} style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 12, border: '2px solid #e65100', objectFit: 'cover' }} />
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{mediator.name}</div>
            <div style={{ fontSize: 14, color: '#b26a00', marginBottom: 4 }}>Joined: {mediator.joined}</div>
            <span style={{
              fontSize: 13,
              color: mediator.status === 'verified' ? '#4caf50' : '#ff9800',
              fontWeight: 600,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '2px 12px',
              marginBottom: 4
            }}>{mediator.status}</span>
            <div style={{ fontSize: 14, color: '#888' }}>Matches: {mediator.completedMatches}</div>
          </div>
        ))}
        {filtered.length === 0 && <div>No mediators found.</div>}
      </div>
    </div>
  );
} 