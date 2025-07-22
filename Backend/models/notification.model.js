const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  mediaType: { type: String, default: 'none' },
  mediaUrl: { type: String },
  type: { 
    type: String, 
    enum: [
      'event',
      'interest_received',
      'interest_accepted',
      'direct_chat_request',
      'direct_chat_accepted'
    ],
    default: 'event'
  },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['unread', 'read', 'actioned'],
    default: 'unread'
  }
});

// Index for faster queries
notificationSchema.index({ recipients: 1, status: 1 });
notificationSchema.index({ type: 1, 'metadata.interestId': 1 });

module.exports = mongoose.model('Notification', notificationSchema); 