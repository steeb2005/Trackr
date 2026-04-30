const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  description: String,
  dueDate: String,
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  category: { type: String, enum: ['work', 'personal', 'health', 'study', 'finance', 'events'], default: 'personal' },
  isComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Task', TaskSchema);
