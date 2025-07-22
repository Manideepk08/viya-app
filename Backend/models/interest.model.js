const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  paymentAmount: { type: Number, required: true }, // 199 or 3000
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interest', interestSchema); 