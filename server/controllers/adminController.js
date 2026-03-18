const { pool }   = require('../config/db');
const User        = require('../models/User');
const Product     = require('../models/Product');

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    const [[{ total_users }]]    = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_products }]] = await pool.query('SELECT COUNT(*) AS total_products FROM products');
    const [[{ total_sold }]]     = await pool.query('SELECT COUNT(*) AS total_sold FROM products WHERE status = "sold"');
    const [[{ total_reviews }]]  = await pool.query('SELECT COUNT(*) AS total_reviews FROM reviews');
    const [[{ banned_users }]]   = await pool.query('SELECT COUNT(*) AS banned_users FROM users WHERE is_banned = 1');

    res.json({ total_users, total_products, total_sold, total_reviews, banned_users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/admin/users
async function getUsers(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await User.getAll({ page: parseInt(page), limit: parseInt(limit) });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PATCH /api/admin/users/:id/ban
async function banUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot ban an admin' });

    await User.ban(req.params.id);
    res.json({ message: `User ${user.username} has been banned` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PATCH /api/admin/users/:id/unban
async function unbanUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.unban(req.params.id);
    res.json({ message: `User ${user.username} has been unbanned` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/admin/products
async function getAllProducts(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [rows] = await pool.query(
      `SELECT p.*, u.username AS seller_name, c.name AS category_name
       FROM products p
       JOIN users      u ON p.seller_id   = u.id
       JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]
    );
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM products');
    res.json({ rows, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// DELETE /api/admin/products/:id  (already handled in productController with admin role check)
// But kept here for explicit admin route if needed
async function deleteProduct(req, res) {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.delete(req.params.id);
    res.json({ message: 'Product removed by admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getStats, getUsers, banUser, unbanUser, getAllProducts, deleteProduct };
