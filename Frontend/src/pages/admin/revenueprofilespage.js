import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockTransactions = [
  { id: 1, date: '2023-06-01', amount: 199, user: 'User A', type: 'interest' },
  { id: 2, date: '2023-06-02', amount: 3500, user: 'Mediator X', type: 'commission' },
  { id: 3, date: '2023-06-05', amount: 499, user: 'User B', type: 'profile upgrade' },
  { id: 4, date: '2023-06-07', amount: 1200, user: 'User C', type: 'premium membership' }
];

export default function RevenueProfilesPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const filtered = mockTransactions.filter(t =>
    t.user.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => navigate('/admin-dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24 }} title="Back to Dashboard">
        <span style={{ fontSize: 28, color: '#e65100' }}>←</span>
      </button>
      <h2 style={{ fontSize: 28, color: '#e65100', marginBottom: 24 }}>Revenue Transactions</h2>
      <input
        type="text"
        placeholder="Search by user or type..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          padding: 10, borderRadius: 8, border: '1px solid #ccc', marginBottom: 24, width: 300
        }}
      />
      <div>
        {filtered.map(txn => (
          <div key={txn.id} style={{
            background: '#fff3e0', borderRadius: 12, padding: 18, marginBottom: 16,
            boxShadow: '0 2px 8px #ffd70022', color: '#23243a'
          }}>
            <strong>{txn.user}</strong> <span style={{ color: '#b26a00' }}>({txn.type})</span>
            <div>Date: {txn.date}</div>
            <div>Amount: ₹{txn.amount}</div>
          </div>
        ))}
        {filtered.length === 0 && <div>No transactions found.</div>}
      </div>
    </div>
  );
} 