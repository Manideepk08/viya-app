import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the structure of the User object for TypeScript
interface User {
  _id: string;
  fullName: string;
  email?: string;
  dob?: string;
  city?: string;
  state?: string;
  isProfileComplete: boolean;
  // Add any other fields from your user model that you might use
}

// Assuming your other dashboard components are imported here
// import Filters from '../../components/dashboard/Filters';
// import MatchList from './Matchlist';
// import Footer from '../../components/dashboard/footer';
// import Navbar from '../../components/dashboard/navbar';

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in again.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const res = await axios.get('http://localhost:5000/users/me', config);
        setUser(res.data);
      } catch (err) {
        setError('Failed to fetch user data. Please try logging in again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="dashboard-container">
      {/* You can re-integrate your Navbar and other components here */}
      {/* <Navbar user={user} /> */}
      
      <h1>Welcome to your Dashboard, {user.fullName}!</h1>
      <p>This is where you'll find your matches and manage your profile.</p>

      <div>
        <h2>Your Profile Summary</h2>
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
        <p><strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}</p>
        <p><strong>Location:</strong> {user.city}, {user.state}</p>
        <p><strong>Profile Status:</strong> {user.isProfileComplete ? 'Complete' : 'Incomplete'}</p>
      </div>

      {/* You can re-integrate your Filters and MatchList here */}
      {/* <div className="dashboard-main-content">
        <Filters />
        <MatchList />
      </div> */}

      {/* <Footer /> */}
    </div>
  );
};

export default DashboardPage; 