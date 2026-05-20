const TaskNote = require('../models/TaskNote');

// GET all task notes for a user
const getTaskNotes = async (req, res) => {
    try {
        const taskNotes = await TaskNote.find({ userId: req.userId });
        // Convert array to object grouped by taskId
        const notesByTask = taskNotes.reduce((acc, note) => {
        if (!acc[note.taskId]) acc[note.taskId] = [];
            acc[note.taskId].push(note.content);
            return acc;
        }, {});
        res.json({ taskNotes: notesByTask });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST task note(s) - replaces all notes for a given task
const createTaskNote = async (req, res) => {
    try {
        const { taskId, content } = req.body;

        // Delete existing notes for this task and user
        await TaskNote.deleteMany({ userId: req.userId, taskId });

        // Create new notes (content is an array)
        const notes = content.map(item =>
        new TaskNote({
            userId: req.userId,
            taskId,
            content: item
        })
        );

        const savedNotes = await TaskNote.insertMany(notes);
        res.status(201).json(savedNotes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE specific task note
const deleteTaskNote = async (req, res) => {
    try {
        const { taskId, content } = req.body;
        await TaskNote.findOneAndDelete({
            userId: req.userId,
            taskId,
            content
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getTaskNotes,
    createTaskNote,
    deleteTaskNote
};
