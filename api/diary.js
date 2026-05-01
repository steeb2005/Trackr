const { getDiaryEntries, createDiaryEntry, deleteDiaryEntry } = require('../server/controller/diaryController');
const { protect } = require('../server/middleware/authMiddleware');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await protect(req, res, () => {});
  } catch (err) {
    return res.status(401).json({ message: err.message || 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      return getDiaryEntries(req, res);
    }
    if (req.method === 'POST') {
      return createDiaryEntry(req, res);
    }
    if (req.method === 'DELETE') {
      return deleteDiaryEntry(req, res);
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};