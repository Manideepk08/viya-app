const express = require('express');
const router = express.Router();
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Send notification to users/mediators
router.post('/send', async (req, res) => {
  const { title, message, mediaType, mediaUrl, type, recipientType } = req.body;
  let recipients = [];
  if (recipientType === 'user') {
    recipients = await User.find({ role: 'user' }).select('_id');
  } else if (recipientType === 'mediator') {
    recipients = await User.find({ role: 'mediator' }).select('_id');
  } else {
    recipients = await User.find().select('_id');
  }
  console.log('Recipients found:', recipients.map(r => r._id));
  const notification = new Notification({
    title,
    message,
    mediaType,
    mediaUrl,
    type,
    recipients: recipients.map(r => r._id)
  });
  await notification.save();
  console.log('Notification saved:', notification);
  res.json({ success: true, notification });
});

// Get notifications for a user/mediator
router.get('/for/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Fetching notifications for userId:', userId);
  const notifications = await Notification.find({ recipients: userId }).sort({ createdAt: -1 });
  console.log('Notifications found:', notifications);
  res.json(notifications);
});

module.exports = router; 