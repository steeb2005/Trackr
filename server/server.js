const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// MongoDB Connection
const MONGOURL = process.env.MONGOURL;
const connectOptions = {
  dbName: 'trackrdb',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

mongoose
    .connect(MONGOURL, connectOptions)
    .then(() => console.log("trackrdb successfully connected"))
    .catch(err => console.error(err));

// Routes
const taskRoutes = require('./routes/taskRoute');
app.use('/api/tasks', taskRoutes);

const diaryRoutes = require('./routes/diaryRoute');
app.use('/api/diary', diaryRoutes);

const noteRoutes = require('./routes/noteRoute');
app.use('/api/notes', noteRoutes);

const taskNoteRoutes = require('./routes/taskNoteRoute');
app.use('/api/task-notes', taskNoteRoutes);

const authRoutes = require('./routes/authRoute');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});