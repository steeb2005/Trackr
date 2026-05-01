const { registerUser, loginUser, getMe } = require('../server/controller/authController');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url; // Full path: /api/auth/register, /api/auth/login, /api/auth/me

  try {
    if (req.method === 'POST' && (path.endsWith('/register') || path.endsWith('/signin'))) {
      return registerUser(req, res);
    }
    if (req.method === 'POST' && (path.endsWith('/login') || path.endsWith('/signin'))) {
      return loginUser(req, res);
    }
    if (req.method === 'GET' && path.endsWith('/me')) {
      const { protect } = require('../server/middleware/authMiddleware');
      await protect(req, res, () => {});
      return getMe(req, res);
    }

    return res.status(404).json({ error: 'Auth route not found' });
  } catch (err) {
    if (path.endsWith('/me')) {
      return res.status(401).json({ message: err.message || 'Unauthorized' });
    }
    return res.status(500).json({ error: err.message });
  }
};