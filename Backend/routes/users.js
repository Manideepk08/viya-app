const router = require('express').Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
let User = require('../models/user.model');
const auth = require('../middleware/auth');
const path = require('path');
const mongoose = require('mongoose');

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
            
            // Handle file uploads
            if (req.files) {
                // Add paths of uploaded photos to the profile data
                if (req.files.photos) {
                    profileData.photos = req.files.photos.map(file => `/uploads/${file.filename}`);
                }
                // Add path of uploaded video to the profile data
                if (req.files.video) {
                    profileData.video = `/uploads/${req.files.video[0].filename}`;
                }
            }

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
      res.json({
          id: user.id,
          email: user.email,
          mobile: user.mobile,
          isProfileComplete: user.isProfileComplete,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Get all users (for dashboard)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
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