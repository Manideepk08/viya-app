const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    sparse: true,
  },
  mobile: {
    type: String,
    unique: true,
    trim: true,
    sparse: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  // Basic Info
  fullName: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  
  // Contact & Location
  city: { type: String },
  state: { type: String },
  country: { type: String },

  // Professional & Educational
  occupation: { type: String },
  education: [{
    level: { type: String },
    stream: { type: String },
    institute: { type: String },
  }],
  
  // Physical Attributes
  height: { type: String }, // Storing as string for flexibility e.g., "5'10\""
  
  // About & Interests
  aboutMe: { type: String },
  interests: [{ type: String }],
  
  // Photos & Media
  photos: [{ type: String }], // Array of image URLs
  profilePicture: { type: String }, // URL to main profile picture
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;