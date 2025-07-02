const router = require('express').Router();
const jwt = require('jsonwebtoken');
let User = require('../models/user.model');
const auth = require('../middleware/auth');

// @route   POST /users/send-otp
// @desc    Send OTP to user's email or mobile for login/registration
// @access  Public
router.post('/send-otp', async (req, res) => {
    try {
        const { mobileEmail } = req.body;
        
        if (!mobileEmail) {
            return res.status(400).json({ msg: 'Please enter an email or mobile number' });
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mobileEmail);
        const isMobile = /^[6-9]\d{9}$/.test(mobileEmail);

        if (!isEmail && !isMobile) {
            return res.status(400).json({ msg: 'Please enter a valid email or 10-digit mobile number' });
        }
        
        const query = isEmail ? { email: mobileEmail } : { mobile: mobileEmail };

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
        // In a real app, you'd use a service like Nodemailer to send an email.
        // For development, we'll just log the OTP to the console.
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
        const { mobileEmail, otp } = req.body;

        if (!mobileEmail || !otp) {
            return res.status(400).json({ msg: 'Please provide email/mobile and OTP' });
        }
        
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mobileEmail);
        const query = isEmail ? { email: mobileEmail } : { mobile: mobileEmail };

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
router.put('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update user fields from request body
        const {
            fullName, dob, gender, city, state, country,
            occupation, education, height, aboutMe, interests,
            photos, profilePicture
        } = req.body;
        
        // Assign values
        if (fullName) user.fullName = fullName;
        if (dob) user.dob = dob;
        if (gender) user.gender = gender;
        if (city) user.city = city;
        if (state) user.state = state;
        if (country) user.country = country;
        if (occupation) user.occupation = occupation;
        if (education) user.education = education;
        if (height) user.height = height;
        if (aboutMe) user.aboutMe = aboutMe;
        if (interests) user.interests = interests;
        if (photos) user.photos = photos;
        if (profilePicture) user.profilePicture = profilePicture;

        // Mark profile as complete
        user.isProfileComplete = true;
        
        await user.save();
        
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

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

module.exports = router; 