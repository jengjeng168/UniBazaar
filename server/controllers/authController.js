const bcrypt           = require('bcryptjs');
const User             = require('../models/User');
const { generateToken } = require('../config/jwt');

// POST /api/auth/register
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const emailExists    = await User.findByEmail(email);
    if (emailExists) return res.status(409).json({ message: 'Email already registered' });

    const usernameExists = await User.findByUsername(username);
    if (usernameExists) return res.status(409).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 12);
    const id     = await User.create({ username, email, password: hashed });

    const token = generateToken({ id, role: 'user' });
    res.status(201).json({ token, user: { id, username, email, role: 'user' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.is_banned) {
      return res.status(403).json({ message: 'Your account has been banned' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: user.id, role: user.role });
    res.json({
      token,
      user: {
        id:       user.id,
        username: user.username,
        email:    user.email,
        role:     user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login, me };
