const User = require('../models/User');
const Task = require('../models/Task');
const Note = require('../models/Note');
const DiaryEntry = require('../models/DiaryEntry');
const TaskNote = require('../models/TaskNote');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    /*
    // Direct password comparison (plain text)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    } */

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        // Return updated user without password
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/auth – permanently delete the user's account and all associated data
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete all user-owned data in the correct order to avoid orphaned references
    await TaskNote.deleteMany({ userId: req.userId });
    await Task.deleteMany({ userId: req.userId });
    await Note.deleteMany({ userId: req.userId });
    await DiaryEntry.deleteMany({ userId: req.userId });

    // Delete the user account itself
    await User.deleteOne({ _id: req.userId });

    res.json({ message: 'Account and all associated data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser
};
