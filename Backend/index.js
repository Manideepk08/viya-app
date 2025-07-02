const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => {
  res.send('Hello from Viya App Backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
