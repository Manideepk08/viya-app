const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uri = process.env.MONGO_URI;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            tls: true,
        });
        console.log("MongoDB database connection established successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        // Exit process with failure
        process.exit(1);
    }
};

connectDB();

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const notificationsRouter = require('./routes/notifications');
app.use('/notifications', notificationsRouter);

const chatRoutes = require('./routes/chats');
app.use('/chats', chatRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Viya App Backend!');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Track which users are online (for presence)
const onlineUsers = new Set();

// Socket.IO connection
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
    onlineUsers.add(userId);
    // Notify others this user is online
    io.emit('presence:update', { userId, online: true });
  });

  socket.on('typing', ({ to, from }) => {
    io.to(to).emit('chat:typing', { from });
  });

  socket.on('stopTyping', ({ to, from }) => {
    io.to(to).emit('chat:stopTyping', { from });
  });

  socket.on('disconnecting', () => {
    // Find all rooms this socket was in (userId)
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        onlineUsers.delete(room);
        io.emit('presence:update', { userId: room, online: false, lastSeen: Date.now() });
      }
    }
  });
});

app.set('io', io); // Make io accessible in routes

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
