const { pool } = require('../config/db');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, email, role, is_banned, avatar, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ username, email, password, role = 'user' }) {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    );
    return result.insertId;
  },

  async ban(id) {
    await pool.query('UPDATE users SET is_banned = 1 WHERE id = ?', [id]);
  },

  async unban(id) {
    await pool.query('UPDATE users SET is_banned = 0 WHERE id = ?', [id]);
  },

  async getAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT id, username, email, role, is_banned, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM users');
    return { rows, total };
  },
};

module.exports = User;
