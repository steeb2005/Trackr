const router = require('express').Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser
} = require('../controller/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/update', protect, updateUser);
router.delete('/', protect, deleteUser);

module.exports = router;
