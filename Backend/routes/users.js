const router = require('express').Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
let User = require('../models/user.model');
const auth = require('../middleware/auth');
const path = require('path');
const mongoose = require('mongoose');
const Interest = require('../models/interest.model');
const Notification = require('../models/notification.model');
const Transaction = require('../models/transaction.model');

// --- Multer Configuration ---
// This will store files in a directory named 'uploads' in the 'Backend' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create the directory if it doesn't exist
    const fs = require('fs');
    const uploadPath = path.join(__dirname, '../uploads/');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
// --- End Multer Configuration ---

// @route   POST /users/send-otp
// @desc    Send OTP to user's email or mobile for login/registration
// @access  Public
router.post('/send-otp', async (req, res) => {
    try {
        let { mobileEmail } = req.body;
        if (!mobileEmail) {
            return res.status(400).json({ msg: 'Please enter an email or mobile number' });
        }
        mobileEmail = mobileEmail.trim();
        // Accept mobile numbers with or without country code
        let isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mobileEmail);
        let isMobile = /^\+?\d{10,15}$/.test(mobileEmail) || /^[6-9]\d{9}$/.test(mobileEmail);
        if (!isEmail && !isMobile) {
            return res.status(400).json({ msg: 'Please enter a valid email or mobile number' });
        }
        let query = {};
        if (isEmail) {
            query.email = mobileEmail;
        } else {
            // Remove country code if present
            let mobile = mobileEmail.replace(/^\+91|\D/g, '');
            if (mobile.length > 10) mobile = mobile.slice(-10);
            query.mobile = mobile;
        }
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        const otpExpires = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes expiry
        // Find user or create a new one if they don't exist
        let user = await User.findOne(query);
        if (!user) {
            user = new User(query);
        }
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        // --- OTP Sending Simulation ---
        console.log(`OTP for ${mobileEmail} is: ${otp}`);
        // --- End Simulation ---
        res.json({ msg: `OTP has been sent to ${mobileEmail}. It will expire in 10 minutes.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /users/verify-otp
// @desc    Verify OTP and log the user in
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        let { mobileEmail, otp } = req.body;
        if (!mobileEmail || !otp) {
            return res.status(400).json({ msg: 'Please provide email/mobile and OTP' });
        }
        mobileEmail = mobileEmail.trim();
        let isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mobileEmail);
        let isMobile = /^\+?\d{10,15}$/.test(mobileEmail) || /^[6-9]\d{9}$/.test(mobileEmail);
        let query = {};
        if (isEmail) {
            query.email = mobileEmail;
        } else if (isMobile) {
            let mobile = mobileEmail.replace(/^\+91|\D/g, '');
            if (mobile.length > 10) mobile = mobile.slice(-10);
            query.mobile = mobile;
        } else {
            return res.status(400).json({ msg: 'Please enter a valid email or mobile number' });
        }
        const user = await User.findOne(query);
        if (!user) {
            return res.status(400).json({ msg: 'User not found. Please try sending OTP again.' });
        }
        // Check if OTP is correct and not expired
        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP. Please try again.' });
        }
        // Clear OTP after verification
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        // Create and assign a JWT
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                mobile: user.mobile,
                isProfileComplete: user.isProfileComplete,
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /users/me
// @desc    Create or update user's profile
// @access  Private
router.put(
    '/me', 
    auth, 
    // Use multer middleware to handle 'photos' (up to 5) and 'video' (up to 1)
    upload.fields([{ name: 'photos', maxCount: 5 }, { name: 'video', maxCount: 1 }]), 
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            const profileData = { ...req.body };

            // Parse stringified JSON fields from FormData
            for (const key in profileData) {
                try {
                    profileData[key] = JSON.parse(profileData[key]);
                } catch (e) {
                    // This will fail for non-JSON strings, which is expected.
                    // We just continue and use the raw value.
                }
            }
            
            // Handle file uploads and photo deletion logic
            let finalPhotos = [];
            // Accept both single and multiple existingPhotos[]
            if (profileData['existingPhotos[]']) {
              if (Array.isArray(profileData['existingPhotos[]'])) {
                finalPhotos = profileData['existingPhotos[]'];
              } else {
                finalPhotos = [profileData['existingPhotos[]']];
              }
            }
            if (req.files && req.files.photos) {
              finalPhotos = finalPhotos.concat(req.files.photos.map(file => `/uploads/${file.filename}`));
            }
            // Debug log
            console.log('Final photos array to be saved:', finalPhotos);
            user.photos = finalPhotos;
            // Remove from profileData so Object.assign doesn't overwrite
            delete profileData.photos;
            delete profileData['existingPhotos[]'];

            // Prevent overwriting interaction arrays unless explicitly provided
            if (!('likedProfiles' in profileData)) delete user.likedProfiles;
            if (!('sentInterests' in profileData)) delete user.sentInterests;
            if (!('directChatProfiles' in profileData)) delete user.directChatProfiles;

            // Use Object.assign to update the user with all fields.
            Object.assign(user, profileData);

            // Mark profile as complete
            user.isProfileComplete = true;
            
            await user.save();
            
            res.json(user);

        } catch (err) {
            console.error(err.message, err.stack);
            // Send back a more specific error message to the frontend
            res.status(500).json({ msg: 'Server Error: ' + err.message });
        }
    }
);

// @route   GET /users/me
// @desc    Get current user's data (protected)
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user); // Return the full user object
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Get all users (for dashboard)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-otp -otpExpires');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /users/interactions
// @desc    Get user's sentInterests, likedProfiles, and directChatProfiles
// @access  Private
router.get('/interactions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('sentInterests likedProfiles directChatProfiles');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({
      sentInterests: (user.sentInterests || []).map(id => id.toString()),
      likedProfiles: (user.likedProfiles || []).map(id => id.toString()),
      directChatProfiles: (user.directChatProfiles || []).map(id => id.toString())
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /users/like/:profileId
// @desc    Like or unlike a profile
// @access  Private
router.post('/like/:profileId', auth, async (req, res) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if profile exists
    const targetProfile = await User.findById(profileId);
    if (!targetProfile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    // Check if already liked
    const isLiked = user.likedProfiles.includes(profileId);
    
    if (isLiked) {
      // Unlike
      user.likedProfiles = user.likedProfiles.filter(id => id.toString() !== profileId);
    } else {
      // Like
      user.likedProfiles.push(profileId);
    }
    
    await user.save();
    
    res.json({
      likedProfiles: user.likedProfiles.map(id => id.toString()),
      isLiked: !isLiked
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /users/send-interest/:profileId
// @desc    Send interest to a profile
// @access  Private
router.post('/send-interest/:profileId', auth, async (req, res) => {
  try {
    const { profileId } = req.params;
    if (!profileId || profileId === 'undefined' || profileId === 'null') {
      return res.status(400).json({ msg: 'Invalid profileId' });
    }
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if profile exists
    const targetProfile = await User.findById(profileId);
    if (!targetProfile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    // Check if already sent interest
    if (user.sentInterests.includes(profileId)) {
      return res.status(400).json({ msg: 'Interest already sent to this profile' });
    }
    
    // Add to sent interests
    user.sentInterests.push(profileId);
    await user.save();
    
    res.json({
      sentInterests: user.sentInterests.map(id => id.toString()),
      message: 'Interest sent successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /users/direct-chat/:profileId
// @desc    Add profile to direct chat (after payment)
// @access  Private
router.post('/direct-chat/:profileId', auth, async (req, res) => {
  try {
    const { profileId } = req.params;
    // Enforce payment amount: only allow if amount === 3000
    const { amount } = req.body;
    if (amount !== 3000) {
      return res.status(400).json({ msg: 'Direct chat is only allowed for payments of 3000.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if profile exists
    const targetProfile = await User.findById(profileId);
    if (!targetProfile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    // Log user's current state
    console.log('Current user state:', {
      userId: req.user.id,
      directChatProfiles: user.directChatProfiles,
      checkingProfileId: profileId
    });

    // Check for any existing transactions (both direct_chat and other types)
    const allTransactions = await Transaction.find({
      userId: req.user.id,
      chatId: profileId,
      status: 'completed'
    });

    console.log('Found transactions:', allTransactions);

    // Check if there's a direct chat transaction
    const existingDirectChatTx = allTransactions.find(tx => tx.type === 'direct_chat');

    // Check if there's only an interest transaction (199)
    const onlyInterestTx = allTransactions.length === 1 && 
                          allTransactions[0].type === 'other' && 
                          allTransactions[0].amount === 199;

    // Check if already in direct chat
    if (user.directChatProfiles.includes(profileId)) {
      if (onlyInterestTx) {
        // This is a data inconsistency - user has direct chat access but only paid 199
        console.log('Data inconsistency detected:', {
          profileId,
          transactions: allTransactions,
          directChatAccess: true,
          amount: 199
        });
        
        // Remove from direct chat profiles if only interest payment exists
        user.directChatProfiles = user.directChatProfiles.filter(id => id.toString() !== profileId.toString());
        await user.save();
        
        console.log('Removed inconsistent direct chat access');
      } else {
        return res.status(400).json({ 
          msg: 'Profile already in direct chat',
          details: existingDirectChatTx ? 'Previous direct chat payment exists' : 'Added through different means'
        });
      }
    }

    // Create transaction record
    const directChatTransaction = new Transaction({
        userId: req.user.id,
        amount: amount,
        status: 'pending', // Start as pending until accepted
        type: 'direct_chat',
        chatId: profileId
    });
    await directChatTransaction.save();

    // Create notification for direct chat request
    const notification = await Notification.create({
      title: 'Direct Chat Request',
      message: `${user.fullName || 'A user'} has requested to start a direct chat with you (₹3000 paid)`,
      type: 'direct_chat_request',
      recipients: [profileId],
      metadata: {
        transactionId: directChatTransaction._id,
        senderId: user._id,
        amount: amount
      }
    });

    // Send real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(profileId.toString()).emit('notification:new', {
        title: notification.title,
        message: notification.message,
        type: 'direct_chat_request',
        notificationId: notification._id
      });
    }

    res.json({
      success: true,
      msg: 'Direct chat access granted successfully',
      transaction: directChatTransaction
    });

    // Create a transaction record
    const transaction = new Transaction({
        userId: req.user.id,
        amount: amount,
        status: 'completed',
        type: 'direct_chat',
        chatId: profileId
    });
    await transaction.save();
    // Add to direct chat profiles
    user.directChatProfiles.push(profileId);
    // Also ensure profile is in sentInterests (idempotent)
    if (!user.sentInterests.includes(profileId)) {
      user.sentInterests.push(profileId);
    }
    await user.save();
    
    res.json({
      directChatProfiles: user.directChatProfiles.map(id => id.toString()),
      message: 'Profile added to direct chat successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /users/sent-interest/:profileId
// @desc    Remove sent interest
// @access  Private
router.delete('/sent-interest/:profileId', auth, async (req, res) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Remove from sent interests
    user.sentInterests = user.sentInterests.filter(id => id.toString() !== profileId);
    await user.save();
    
    res.json({
      sentInterests: user.sentInterests.map(id => id.toString()),
      message: 'Interest removed successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /users/opposite-gender
// @desc    Get users of the opposite gender for the current user
// @access  Private
router.get('/opposite-gender', auth, async (req, res) => {
  try {
    console.log('DEBUG /users/opposite-gender req.user:', req.user);
    console.log('DEBUG /users/opposite-gender req.user.id:', req.user && req.user.id);
    const currentUser = await User.findById(req.user.id);
    console.log('DEBUG /users/opposite-gender currentUser:', currentUser);
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    let targetGender = null;
    if (currentUser.gender && typeof currentUser.gender === 'string') {
      const g = currentUser.gender.toLowerCase();
      if (g === 'male') targetGender = 'female';
      else if (g === 'female') targetGender = 'male';
      // Optionally, handle 'other' or custom logic here
    }
    if (!targetGender) {
      return res.status(400).json({ msg: 'Current user gender not set or not supported.' });
    }
    const users = await User.find({ gender: new RegExp('^' + targetGender + '$', 'i') }).select('-otp -otpExpires');
    res.json(users);
  } catch (err) {
    console.error('Error in /users/opposite-gender:', err);
    res.status(500).send('Server Error');
  }
});

// Send interest (199 or 3000 payment)
router.post('/interests/:toUserId', auth, async (req, res) => {
  try {
    const { toUserId } = req.params;
    const { paymentAmount } = req.body;
    if (![199, 3000].includes(Number(paymentAmount))) {
      return res.status(400).json({ msg: 'Invalid payment amount' });
    }
    if (toUserId === req.user.id) {
      return res.status(400).json({ msg: 'Cannot send interest to yourself' });
    }
    const Transaction = require('../models/transaction.model');

    // Check for existing interest
    let interest = await Interest.findOne({ from: req.user.id, to: toUserId });
    
    // Check for existing transaction
    const existingTransaction = await Transaction.findOne({
      userId: req.user.id,
      chatId: toUserId,
      status: 'completed'
    });

    if (interest) {
      return res.status(400).json({ 
        msg: 'Interest already sent',
        details: existingTransaction ? 'Previous transaction exists' : 'Interest sent through different means'
      });
    }

    // Make sure user doesn't have direct chat access if only paying 199
    if (paymentAmount === 199 && user.directChatProfiles.includes(toUserId)) {
      // Check if they have a direct chat transaction
      const directChatTx = await Transaction.findOne({
        userId: req.user.id,
        chatId: toUserId,
        type: 'direct_chat',
        status: 'completed'
      });

      if (!directChatTx) {
        // Remove direct chat access if they haven't paid for it
        user.directChatProfiles = user.directChatProfiles.filter(id => id.toString() !== toUserId.toString());
        await user.save();
        console.log('Removed incorrect direct chat access for 199 payment');
      }
    }

    interest = new Interest({ from: req.user.id, to: toUserId, paymentAmount });
    await interest.save();

    // Create transaction record
    const transaction = new Transaction({
        userId: req.user.id,
        amount: paymentAmount,
        status: 'completed',
        type: 'other',
        chatId: toUserId
    });
    await transaction.save();
    
    // Payment log
    console.log(`[PAYMENT] Interest created: from=${req.user.id} to=${toUserId} paymentAmount=${paymentAmount}`);
    // Send notification to toUserId
    const sender = await User.findById(req.user.id);
    const notification = await Notification.create({
      title: 'New Interest Received',
      message: `${sender.fullName || 'A user'} has sent you an interest request!`,
      mediaType: 'none',
      type: 'event',
      recipients: [toUserId],
      from: req.user.id, // Add sender's userId for frontend navigation
      interestId: interest._id // Add interestId for frontend navigation
    });
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(toUserId).emit('notification:new', {
        title: notification.title,
        message: notification.message,
        notificationId: notification._id,
        from: req.user.id,
        interestId: interest._id
      });
    }
    res.json({ success: true, interest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get incoming interests (sent to me)
router.get('/interests/incoming', auth, async (req, res) => {
  try {
    const interests = await Interest.find({ to: req.user.id }).populate('from', 'fullName photos');
    res.json(interests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get sent interests (I sent)
router.get('/interests/sent', auth, async (req, res) => {
  try {
    const interests = await Interest.find({ from: req.user.id }).populate('to', 'fullName photos');
    res.json(interests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Accept an interest
router.post('/interests/:interestId/accept', auth, async (req, res) => {
  try {
    const { interestId } = req.params;
    const interest = await Interest.findById(interestId);
    
    if (!interest) return res.status(404).json({ msg: 'Interest not found' });
    if (String(interest.to) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    if (interest.status === 'accepted') {
      return res.status(400).json({ msg: 'Interest already accepted' });
    }
    
    interest.status = 'accepted';
    await interest.save();
    
    // Mark the interest notification as actioned
    await Notification.updateMany({
      type: 'interest_received',
      'metadata.interestId': interestId
    }, {
      $set: { status: 'actioned' }
    });
    // Add each other to sentInterests if not already present
    const sender = await User.findById(interest.from);
    const recipient = await User.findById(interest.to);
    if (sender && !sender.sentInterests.includes(interest.to)) {
      sender.sentInterests.push(interest.to);
      await sender.save();
    }
    if (recipient && !recipient.sentInterests.includes(interest.from)) {
      recipient.sentInterests.push(interest.from);
      await recipient.save();
    }
    // Notify sender
    const recipientUser = await User.findById(req.user.id);
    const notification = await Notification.create({
      title: 'Interest Accepted',
      message: `${recipientUser.fullName || 'A user'} has accepted your interest request!`,
      mediaType: 'none',
      type: 'event',
      recipients: [interest.from]
    });
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(interest.from.toString()).emit('notification:new', {
        title: notification.title,
        message: notification.message,
        notificationId: notification._id
      });
    }
    res.json({ success: true, interest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Reject an interest
router.post('/interests/:interestId/reject', auth, async (req, res) => {
  try {
    const { interestId } = req.params;
    const interest = await Interest.findById(interestId);
    if (!interest) return res.status(404).json({ msg: 'Interest not found' });
    if (String(interest.to) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    interest.status = 'rejected';
    await interest.save();
    // Notify sender
    const recipient = await User.findById(req.user.id);
    const notification = await Notification.create({
      title: 'Interest Rejected',
      message: `${recipient.fullName || 'A user'} has rejected your interest request.`,
      mediaType: 'none',
      type: 'event',
      recipients: [interest.from]
    });
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(interest.from.toString()).emit('notification:new', {
        title: notification.title,
        message: notification.message,
        notificationId: notification._id
      });
    }
    res.json({ success: true, interest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a single interest by ID
router.get('/interests/:interestId', auth, async (req, res) => {
  try {
    const { interestId } = req.params;
    const interest = await Interest.findById(interestId);
    if (!interest) return res.status(404).json({ msg: 'Interest not found' });
    res.json(interest);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a single user by ID (ObjectId or string)
router.get('/:id', async (req, res) => {
  try {
    let user = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      user = await User.findById(req.params.id);
    }
    // Fallback: try to find by string id (for legacy/mock data)
    if (!user) {
      user = await User.findOne({ _id: req.params.id });
    }
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router; 