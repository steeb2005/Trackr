const Task = require('../models/Task');

// GET all tasks for logged-in user
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getTaskDueTime = async (req, res) => {
    try {
        const task = await Task.findOne(
            { _id: req.params.id, userId: req.userId },
            { dueTime: 1 }                          // project only what's needed
        );
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ dueTime: task.dueTime });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST new task for logged-in user
const createTask = async (req, res) => {
    try {
        const task = new Task({
        ...req.body,
        userId: req.userId
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT update task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { returnDocument: 'after' }
        );
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskDueTime
};
