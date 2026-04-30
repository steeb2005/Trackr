const Note = require('../models/Note');

// GET all notes for a user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    // Convert array to object grouped by date
    const notesByDate = notes.reduce((acc, note) => {
      if (!acc[note.date]) acc[note.date] = [];
      acc[note.date].push(note.content);
      return acc;
    }, {});
    res.json({ notes: notesByDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new note or replace all notes for a date
const createNote = async (req, res) => {
  try {
    const { date, content } = req.body;

    // Delete existing notes for this date and user
    await Note.deleteMany({ userId: req.userId, date });

    // Create new notes (content is an array)
    const notes = content.map(item =>
      new Note({
        userId: req.userId,
        date,
        content: item
      })
    );

    const savedNotes = await Note.insertMany(notes);
    res.status(201).json(savedNotes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE specific note
const deleteNote = async (req, res) => {
  try {
    const { date, content } = req.body;
    await Note.findOneAndDelete({
      userId: req.userId,
      date,
      content
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getNotes,
  createNote,
  deleteNote
};
