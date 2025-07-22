const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['chat_unlock', 'direct_chat', 'subscription', 'other'],
        required: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: function() {
            return this.type === 'chat_unlock';
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
transactionSchema.index({ userId: 1, status: 1 });
transactionSchema.index({ chatId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
