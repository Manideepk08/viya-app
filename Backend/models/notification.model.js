const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  mediaType: { type: String, enum: ['none', 'image', 'video'], default: 'none' },
  mediaUrl: String, // URL for image or video
  type: { type: String, enum: ['announcement', 'quote', 'update', 'image', 'ad', 'anniversary', 'success', 'event', 'reminder'], default: 'announcement' },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema); 