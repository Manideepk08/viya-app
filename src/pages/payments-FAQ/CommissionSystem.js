import React, { useState, useEffect } from 'react';
import './CommissionSystem.css';

const CommissionSystem = ({ mediatorId }) => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedMatches: 0,
    pendingPayout: 0
  });

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = {
          commissions: [
            {
              id: 1,
              matchId: 'M1001',
              date: '2023-05-15',
              amount: 3500,
              status: 'completed',
              users: ['User A', 'User B']
            },
            {
              id: 2,
              matchId: 'M1002',
              date: '2023-06-20',
              amount: 2800,
              status: 'pending',
              users: ['User C', 'User D']
            }
          ],
          stats: {
            totalEarnings: 12600,
            completedMatches: 4,
            pendingPayout: 2800
          }
        };
        
        setCommissions(mockData.commissions);
        setStats(mockData.stats);
      } catch (error) {
        console.error("Error fetching commissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [mediatorId]);

  if (loading) return (
    <div className="loading-commissions">
      <div className="spinner"></div>
      <p>Loading your commission data...</p>
    </div>
  );

  return (
    <div className="commission-system">
      <h2>Your Earnings</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p>₹{stats.totalEarnings.toLocaleString()}</p>
          <small>(70% of ₹{(stats.totalEarnings / 0.7).toLocaleString()})</small>
        </div>
        
        <div className="stat-card">
          <h3>Successful Matches</h3>
          <p>{stats.completedMatches}</p>
          <small>All time</small>
        </div>
        
        <div className="stat-card">
          <h3>Pending Payout</h3>
          <p>₹{stats.pendingPayout.toLocaleString()}</p>
          <small>Next payout: 15th {new Date().toLocaleString('default', { month: 'long' })}</small>
        </div>
      </div>
      
      <div className="commission-table">
        <h3>Recent Commissions</h3>
        
        <table>
          <thead>
            <tr>
              <th>Match ID</th>
              <th>Date</th>
              <th>Parties</th>
              <th>Amount</th>
              <th>Your Share</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map(commission => (
              <tr key={commission.id}>
                <td>{commission.matchId}</td>
                <td>{new Date(commission.date).toLocaleDateString()}</td>
                <td>{commission.users.join(' & ')}</td>
                <td>₹{commission.amount}</td>
                <td>₹{Math.floor(commission.amount * 0.7)}</td>
                <td>
                  <span className={`status-badge ${commission.status}`}>
                    {commission.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="payout-info">
        <p>
          <strong>Commission Policy:</strong> You receive 70% of each match commission (₹1000-₹5000 per match). 
          Payouts are processed monthly on the 15th.
        </p>
        <button className="btn btn-primary">
          Request Early Payout
        </button>
      </div>
    </div>
  );
};

export default CommissionSystem;