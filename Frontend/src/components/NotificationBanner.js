import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const NotificationBanner = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/notifications/for/${userId}`)
      .then(res => setNotifications(res.data || []))
      .catch(() => setNotifications([]));
  }, [userId]);

  useEffect(() => {
    if (notifications.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % notifications.length);
      }, 4000);
      return () => clearInterval(intervalRef.current);
    }
  }, [notifications]);

  if (!notifications.length) return null;
  const n = notifications[current];

  return (
    <div style={{ width: '100%', background: '#23243a', color: '#fff', padding: 16, borderRadius: 12, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 2px 8px #ffd70055', minHeight: 80 }}>
      {n.mediaType === 'image' && n.mediaUrl && (
        <img src={n.mediaUrl} alt="notification" style={{ maxHeight: 60, maxWidth: 100, borderRadius: 8 }} />
      )}
      {n.mediaType === 'video' && n.mediaUrl && (
        <video src={n.mediaUrl} controls style={{ maxHeight: 60, maxWidth: 100, borderRadius: 8 }} />
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#ffd700', marginBottom: 4 }}>{n.title || n.type}</div>
        <div style={{ fontSize: 16 }}>{n.message}</div>
      </div>
    </div>
  );
};

export default NotificationBanner; 