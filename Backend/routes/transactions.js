const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.model');
const Chat = require('../models/chat.model');
const auth = require('../middleware/auth');

// Create a new transaction
router.post('/', auth, async (req, res) => {
    try {
        const { amount, type, chatId } = req.body;
        const userId = req.user._id;

        // Validate transaction type
        if (!['chat_unlock', 'subscription', 'other'].includes(type)) {
            return res.status(400).json({ message: 'Invalid transaction type' });
        }

        // If it's a chat unlock transaction, verify the chat exists
        if (type === 'chat_unlock' && chatId) {
            const chat = await Chat.findById(chatId);
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }
        }

        const transaction = new Transaction({
            userId,
            amount,
            type,
            chatId: type === 'chat_unlock' ? chatId : undefined
        });

        await transaction.save();

        res.status(201).json({
            success: true,
            transaction
        });
    } catch (error) {
        console.error('Transaction creation error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user's transactions
router.get('/my-transactions', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('chatId', 'participants')
            .lean();

        res.json(transactions);
    } catch (error) {
        console.error('Fetch transactions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Check if chat is unlocked for user
router.get('/check-chat/:chatId', auth, async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const userId = req.user._id;

        // Check if there's a completed transaction for this chat
        const transaction = await Transaction.findOne({
            userId,
            chatId,
            type: 'chat_unlock',
            status: 'completed'
        });

        res.json({
            isUnlocked: !!transaction
        });
    } catch (error) {
        console.error('Check chat transaction error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update transaction status (could be used after payment confirmation)
router.patch('/:transactionId', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const transaction = await Transaction.findById(req.params.transactionId);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Ensure user can only update their own transactions
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        transaction.status = status;
        await transaction.save();

        res.json(transaction);
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
