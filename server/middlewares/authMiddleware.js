const { verifyToken } = require('../config/jwt');
const { pool }        = require('../config/db');

// Verify JWT and attach user to req
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token   = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Fetch fresh user from DB (catches banned users mid-session)
    const [rows] = await pool.query(
      'SELECT id, username, email, role, is_banned FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = rows[0];
    if (user.is_banned) {
      return res.status(403).json({ message: 'Your account has been banned' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Only allow admins
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = { authenticate, adminOnly };
