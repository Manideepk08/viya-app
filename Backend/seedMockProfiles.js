const mongoose = require('mongoose');
const User = require('./models/user.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

const mockProfiles = [
  {
    name: 'Priya Sharma',
    age: 26,
    city: 'Mumbai',
    state: 'Maharashtra',
    education: 'MBA Finance',
    job: 'Financial Analyst',
    gotra: 'Shandilya',
    bio: 'Passionate about coding and exploring new technologies. Enjoys hiking and reading fiction.',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww',
    ],
  },
  {
    name: 'Anjali Patel',
    age: 24,
    city: 'Bangalore',
    state: 'Karnataka',
    education: 'B.Tech Computer Science',
    job: 'Software Engineer',
    gotra: 'Kashyapa',
    bio: 'Loves traveling and photography. Looking for a partner who shares similar interests.',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww',
    ],
  },
  {
    name: 'Rahul Kumar',
    age: 30,
    city: 'Mumbai',
    state: 'Maharashtra',
    education: 'MBA',
    job: 'Marketing Manager',
    gotra: 'Bharadwaja',
    bio: 'Loves traveling and photography. Looking for a partner who shares similar interests.',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww'
    ],
  },
  {
    name: 'Anjali Singh',
    age: 26,
    city: 'Delhi',
    state: 'Delhi',
    education: 'B.Sc (Nursing)',
    job: 'Nurse',
    gotra: 'Shandilya',
    bio: 'Dedicated to helping others. Enjoys quiet evenings, cooking, and spending time with family.',
    photos: [
      'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
    ],
  },
  {
    name: 'Vikram Patel',
    age: 32,
    city: 'Hyderabad',
    state: 'Telangana',
    education: 'Ph.D (Physics)',
    job: 'Research Scientist',
    gotra: 'Gautama',
    bio: 'Curious mind, always learning. Interested in science, music, and philosophical discussions.',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
    ],
  },
  {
    name: 'Sneha Reddy',
    age: 29,
    city: 'Chennai',
    state: 'Tamil Nadu',
    education: 'B.Arch',
    job: 'Architect',
    gotra: 'Vashishta',
    bio: 'Creative and loves designing. Enjoys sketching, urban exploration, and good coffee.',
    photos: [
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8fDB8fHww',
    ],
  },
  {
    name: 'Kavita Das',
    age: 27,
    city: 'Kolkata',
    state: 'West Bengal',
    education: 'M.A. (Literature)',
    job: 'Content Writer',
    gotra: 'Angirasa',
    bio: 'A lover of classic literature and Rabindra Sangeet. Seeks intellectual companionship.',
    photos: ['https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D'],
  },
  {
    name: 'Amit Singh',
    age: 31,
    city: 'Pune',
    state: 'Maharashtra',
    education: 'B.E. (Mechanical)',
    job: 'Product Manager',
    gotra: 'Kashyapa',
    bio: 'Enthusiastic about sports and tech gadgets. Values honesty and a positive outlook.',
    photos: ['https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVyc29ufGVufDB8fDB8fHww'],
  },
];

const mappedProfiles = mockProfiles.map((p, i) => ({
  fullName: p.name,
  age: p.age,
  city: p.city,
  state: p.state,
  education: [{ level: 'degree', stream: p.education, institute: '' }],
  employeeRole: p.job,
  gotra: p.gotra,
  aboutMe: p.bio,
  photos: p.photos,
  email: `mockuser${i + 1}@example.com`,
  mobile: `90000000${(i + 10)}`,
  profilePicture: p.photos[0],
  isProfileComplete: true,
}));

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');
  // Optionally: await User.deleteMany({}); // Uncomment to clear existing users
  await User.insertMany(mappedProfiles);
  console.log('Mock profiles inserted!');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
}); 