const router = require('express').Router();
const mongoose = require('mongoose');
const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Interest = require('../models/interest.model');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, 'chat-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get chat history between current user and profileId
router.get('/:profileId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ msg: 'Invalid profileId' });
    }
    // Check mutual acceptance and payment
    const myInterest = await Interest.findOne({ from: userId, to: profileId, status: 'accepted' });
    const theirInterest = await Interest.findOne({ from: profileId, to: userId, status: 'accepted' });
    if (!myInterest || !theirInterest || (myInterest.paymentAmount !== 3000 && theirInterest.paymentAmount !== 3000)) {
      return res.status(403).json({ msg: 'Chat is only available after mutual acceptance and 3000 payment.' });
    }
    const chat = await Chat.findOne({
      participants: { $all: [userId, profileId] }
    }).populate('messages.sender', 'name photos');
    res.json(chat ? chat.messages : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Send a message to profileId
router.post('/:profileId/message', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ msg: 'Message text required' });
    }
    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ msg: 'Invalid profileId' });
    }
    // Check mutual acceptance and payment
    const myInterest = await Interest.findOne({ from: userId, to: profileId, status: 'accepted' });
    const theirInterest = await Interest.findOne({ from: profileId, to: userId, status: 'accepted' });
    if (!myInterest || !theirInterest || (myInterest.paymentAmount !== 3000 && theirInterest.paymentAmount !== 3000)) {
      return res.status(403).json({ msg: 'Chat is only available after mutual acceptance and 3000 payment.' });
    }
    let chat = await Chat.findOne({
      participants: { $all: [userId, profileId] }
    });
    if (!chat) {
      chat = new Chat({ participants: [userId, profileId], messages: [] });
    }
    const newMsg = { sender: userId, text, delivered: true };
    chat.messages.push(newMsg);
    await chat.save();
    const io = req.app.get('io');
    io.to(userId).emit('chat:newMessage', { chatId: chat._id, message: { ...newMsg, timestamp: new Date() }, from: userId, to: profileId });
    io.to(profileId).emit('chat:newMessage', { chatId: chat._id, message: { ...newMsg, timestamp: new Date() }, from: userId, to: profileId });
    io.to(profileId).emit('chat:delivered', { chatId: chat._id, message: { ...newMsg, timestamp: new Date() }, from: userId, to: profileId });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Upload a file as a chat message
router.post('/:profileId/file', auth, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    let chat = await Chat.findOne({
      participants: { $all: [userId, profileId] }
    });
    if (!chat) {
      chat = new Chat({ participants: [userId, profileId], messages: [] });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype.startsWith('image') ? 'image' : req.file.mimetype;
    const newMsg = { sender: userId, fileUrl, fileType, delivered: true };
    chat.messages.push(newMsg);
    await chat.save();
    const io = req.app.get('io');
    io.to(userId).emit('chat:newMessage', { chatId: chat._id, message: { ...newMsg, timestamp: new Date() }, from: userId, to: profileId });
    io.to(profileId).emit('chat:newMessage', { chatId: chat._id, message: { ...newMsg, timestamp: new Date() }, from: userId, to: profileId });
    io.to(profileId).emit('chat:delivered', { chatId: chat._id, message: { ...newMsg, timestamp: new Date() }, from: userId, to: profileId });
    res.json({ success: true, fileUrl, fileType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Mark messages as read
router.post('/:profileId/read', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    let chat = await Chat.findOne({
      participants: { $all: [userId, profileId] }
    });
    if (chat) {
      let updated = false;
      chat.messages.forEach(msg => {
        if (String(msg.sender) !== String(userId) && !msg.read) {
          msg.read = true;
          updated = true;
        }
      });
      if (updated) await chat.save();
      const io = req.app.get('io');
      io.to(userId).emit('chat:read', { chatId: chat._id, userId });
      io.to(profileId).emit('chat:read', { chatId: chat._id, userId });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Edit a message
router.patch('/:profileId/message/:messageId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId, messageId } = req.params;
    const { text } = req.body;
    let chat = await Chat.findOne({ participants: { $all: [userId, profileId] } });
    if (!chat) return res.status(404).json({ msg: 'Chat not found' });
    const msg = chat.messages.id(messageId);
    if (!msg) return res.status(404).json({ msg: 'Message not found' });
    if (String(msg.sender) !== String(userId)) return res.status(403).json({ msg: 'Not allowed' });
    msg.text = text;
    await chat.save();
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a message
router.delete('/:profileId/message/:messageId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId, messageId } = req.params;
    let chat = await Chat.findOne({ participants: { $all: [userId, profileId] } });
    if (!chat) return res.status(404).json({ msg: 'Chat not found' });
    const msg = chat.messages.id(messageId);
    if (!msg) return res.status(404).json({ msg: 'Message not found' });
    if (String(msg.sender) !== String(userId)) return res.status(403).json({ msg: 'Not allowed' });
    msg.remove();
    await chat.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 