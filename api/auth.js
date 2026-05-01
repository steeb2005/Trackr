const { registerUser, loginUser, getMe } = require('../server/controller/authController');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST' && req.url === '/register') {
      return registerUser(req, res);
    }
    if (req.method === 'POST' && req.url === '/login') {
      return loginUser(req, res);
    }
    if (req.method === 'GET' && req.url === '/me') {
      // For /me, apply auth
      const { protect } = require('../server/middleware/authMiddleware');
      await protect(req, res, () => {});
      return getMe(req, res);
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    // For /me route errors from protect
    if (req.url === '/me') {
      return res.status(401).json({ message: err.message || 'Unauthorized' });
    }
    return res.status(500).json({ error: err.message });
  }
};