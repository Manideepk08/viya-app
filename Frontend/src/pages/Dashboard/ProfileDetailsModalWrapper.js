import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileDetailsModal from '../../components/dashboard/ProfileDetailsModal';

const ProfileDetailsModalWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</div>;
  if (error || !profile) return <div style={{textAlign: 'center', marginTop: '2rem'}}>Profile not found.</div>;

  return (
    <ProfileDetailsModal
      profile={profile}
      isOpen={true}
      onClose={() => navigate(-1)}
    />
  );
};

export default ProfileDetailsModalWrapper; 