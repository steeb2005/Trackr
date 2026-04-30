const router = require('express').Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controller/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
