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
  // Basic Personal Details
  fullName: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'male', 'female', 'other'] },
  dob: { type: Date },
  maritalStatus: { type: String },
  height: { type: String },
  weight: { type: String },
  bloodGroup: { type: String },
  aboutMe: { type: String },
  photos: [{ type: String }],
  video: { type: String },
  
  // Contact Information
  phone: { type: String },
  aadhar: { type: String },
  residingAddress: {
    address: { type: String },
    village: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  nativeAddress: {
    address: { type: String },
    village: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },

  // Education and Occupation
  education: [{
    level: { type: String },
    stream: { type: String },
    institute: { type: String },
  }],
  employeeRole: { type: String },
  company: { type: String },
  annualSalary: { type: String },
  workLocation: {
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  
  // Family Details
  familyType: { type: String },
  familyStatus: { type: String },
  fatherName: { type: String },
  fatherOccupation: { type: String },
  motherName: { type: String },
  motherOccupation: { type: String },
  parentsTogether: { type: Boolean },
  siblings: [{
    relation: { type: String },
    gender: { type: String },
    occupation: { type: String },
  }],
  
  // Cultural and Religion
  religion: { type: String },
  community: { type: String },
  gothram: { type: String },
  motherTongue: { type: String },
  zodiacSign: { type: String },
  
  // Lifestyle, Habits, Health
  dietaryHabits: { type: String },
  smoking: { type: String },
  drinking: { type: String },
  hobbies: { type: String },
  disabilities: { type: String },
  medicalConditions: { type: String },
  
  profilePicture: { type: String }, // Keep for main profile picture
}, {
  timestamps: true,
  // Make Mongoose accept fields not strictly defined in the schema
  strict: false,
});

const User = mongoose.model('User', userSchema);

module.exports = User;