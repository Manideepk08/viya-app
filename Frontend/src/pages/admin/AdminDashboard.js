import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [mediators, setMediators] = useState([]);
  const [transactions, setTransactions] = useState([]);

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
          { id: 2, date: '2023-06-02', amount: 3500, user: 'Mediator X', type: 'commission' }
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

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Administration Panel</h2>
        <div className="admin-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => handleTabChange('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => handleTabChange('users')}
          >
            User Management
          </button>
          <button 
            className={activeTab === 'mediators' ? 'active' : ''}
            onClick={() => handleTabChange('mediators')}
          >
            Mediator Verification
          </button>
          <button 
            className={activeTab === 'transactions' ? 'active' : ''}
            onClick={() => handleTabChange('transactions')}
          >
            Transactions
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="admin-overview">
            <div className="stats-row">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>1,248</p>
                <small>+12% this month</small>
              </div>
              <div className="stat-card">
                <h3>Active Mediators</h3>
                <p>47</p>
                <small>8 pending verification</small>
              </div>
              <div className="stat-card">
                <h3>Monthly Revenue</h3>
                <p>₹2,49,600</p>
                <small>30% from commissions</small>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <ul>
                <li>5 new user signups today</li>
                <li>3 matches completed yesterday</li>
                <li>2 mediator applications pending</li>
                <li>System update scheduled for tonight</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-management">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.joined}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm">View</button>
                      <button className="btn btn-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'mediators' && (
          <div className="mediator-verification">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Joined</th>
                  <th>Matches</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mediators.map(mediator => (
                  <tr key={mediator.id}>
                    <td>{mediator.id}</td>
                    <td>{mediator.name}</td>
                    <td>{mediator.joined}</td>
                    <td>{mediator.completedMatches}</td>
                    <td>
                      <span className={`status-badge ${mediator.status}`}>
                        {mediator.status}
                      </span>
                    </td>
                    <td>
                      {mediator.status === 'pending' && (
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => verifyMediator(mediator.id)}
                        >
                          Verify
                        </button>
                      )}
                      <button className="btn btn-sm">View Docs</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transaction-log">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn.id}>
                    <td>{txn.id}</td>
                    <td>{txn.date}</td>
                    <td>₹{txn.amount}</td>
                    <td>{txn.user}</td>
                    <td>{txn.type}</td>
                    <td>
                      <button className="btn btn-sm">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;