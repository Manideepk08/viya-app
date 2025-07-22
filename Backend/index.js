const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uri = process.env.MONGO_URI;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            tls: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log("MongoDB database connection established successfully");
        
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });

    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        // Wait 5 seconds before retrying
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

connectDB();

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const notificationsRouter = require('./routes/notifications');
app.use('/notifications', notificationsRouter);

const chatRoutes = require('./routes/chats');
app.use('/chats', chatRoutes);

const transactionsRouter = require('./routes/transactions');
app.use('/transactions', transactionsRouter);

const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Viya App Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Test database connection endpoint
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: 'ok',
      database: {
        state: dbStatus[dbState],
        connected: dbState === 1
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error checking database health',
      error: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
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
