const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGOURL = process.env.MONGOURL;
mongoose
    .connect(MONGOURL)
    .then(() => console.log("MongoDB connected"))
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