const router = require('express').Router();
const {
  getTaskNotes,
  createTaskNote,
  deleteTaskNote
} = require('../controller/taskNoteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTaskNotes);
router.post('/', protect, createTaskNote);
router.delete('/', protect, deleteTaskNote);

module.exports = router;
