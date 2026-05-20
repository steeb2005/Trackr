const mongoose = require('mongoose');

const TaskNoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model('TaskNote', TaskNoteSchema);
