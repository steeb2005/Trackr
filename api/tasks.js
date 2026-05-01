// Vercel serverless function for tasks routes
const { getTasks, createTask, updateTask, deleteTask } = require('../server/controller/taskController');
const { protect } = require('../server/middleware/authMiddleware');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apply auth middleware manually
  try {
    await protect(req, res, () => {});
  } catch (err) {
    return res.status(401).json({ message: err.message || 'Unauthorized' });
  }

  // Route by method
  try {
    if (req.method === 'GET') {
      return getTasks(req, res);
    }
    if (req.method === 'POST') {
      return createTask(req, res);
    }
    if (req.method === 'PUT') {
      return updateTask(req, res);
    }
    if (req.method === 'DELETE') {
      return deleteTask(req, res);
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};