// This script moves orphaned files in the uploads/ folder to uploads/trash/ instead of deleting them.
// To automate, run this script with a cron job (Linux/Mac) or Task Scheduler (Windows).
// Example cron: 0 3 * * 0 cd /path/to/Backend && node scripts/cleanup-orphaned-uploads.js >> cleanup.log 2>&1

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/user.model');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const TRASH_DIR = path.join(UPLOADS_DIR, 'trash');
const MONGO_URI = 'mongodb://localhost:27017/viya-app'; // Change if needed

async function main() {
  await mongoose.connect(MONGO_URI);

  // 1. Get all used photo paths
  const users = await User.find({}, 'photos');
  const usedPhotos = new Set();
  users.forEach(user => {
    (user.photos || []).forEach(photo => usedPhotos.add(photo));
  });

  // 2. List all files in uploads/
  const files = fs.readdirSync(UPLOADS_DIR).filter(f => f !== 'trash');

  // 3. Ensure trash directory exists
  if (!fs.existsSync(TRASH_DIR)) fs.mkdirSync(TRASH_DIR);

  // 4. Find and move orphaned files to trash
  let moved = 0;
  files.forEach(file => {
    const relPath = `/uploads/${file}`;
    if (!usedPhotos.has(relPath)) {
      fs.renameSync(path.join(UPLOADS_DIR, file), path.join(TRASH_DIR, file));
      console.log('Moved orphaned file to trash:', file);
      moved++;
    }
  });

  console.log(`Cleanup complete. Moved ${moved} orphaned files to trash.`);
  mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 