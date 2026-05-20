const DiaryEntry = require('../models/DiaryEntry');

// GET all diary entries for logged-in user
const getDiaryEntries = async (req, res) => {
    try {
        const entries = await DiaryEntry.find({ userId: req.userId }).sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        es.status(500).json({ error: err.message });
    }
};

// POST new diary entry
const createDiaryEntry = async (req, res) => {
    try {
        const entry = new DiaryEntry({
        ...req.body,
        userId: req.userId
        });
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE diary entry
const deleteDiaryEntry = async (req, res) => {
    try {
        const entry = await DiaryEntry.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
        });
        if (!entry) {
            return res.status(404).json({ error: 'Diary entry not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getDiaryEntries,
    createDiaryEntry,
    deleteDiaryEntry
};
