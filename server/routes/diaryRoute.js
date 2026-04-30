const router = require('express').Router();
const {
  getDiaryEntries,
  createDiaryEntry,
  deleteDiaryEntry
} = require('../controller/diaryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDiaryEntries);
router.post('/', protect, createDiaryEntry);
router.delete('/:id', protect, deleteDiaryEntry);

module.exports = router;
