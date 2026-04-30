const router = require('express').Router();
const {
  getNotes,
  createNote,
  deleteNote
} = require('../controller/noteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotes);
router.post('/', protect, createNote);
router.delete('/', protect, deleteNote);

module.exports = router;
