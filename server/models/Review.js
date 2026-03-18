const { pool } = require('../config/db');

const Review = {
  async getBySeller(sellerId) {
    const [rows] = await pool.query(
      `SELECT r.*, u.username AS reviewer_name
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.seller_id = ?
       ORDER BY r.created_at DESC`,
      [sellerId]
    );
    return rows;
  },

  async create({ seller_id, reviewer_id, rating, comment }) {
    const [result] = await pool.query(
      'INSERT INTO reviews (seller_id, reviewer_id, rating, comment) VALUES (?, ?, ?, ?)',
      [seller_id, reviewer_id, rating, comment || null]
    );
    return result.insertId;
  },

  async exists(seller_id, reviewer_id) {
    const [rows] = await pool.query(
      'SELECT id FROM reviews WHERE seller_id = ? AND reviewer_id = ?',
      [seller_id, reviewer_id]
    );
    return rows.length > 0;
  },

  async getAverageRating(sellerId) {
    const [rows] = await pool.query(
      'SELECT avg_rating, review_count FROM seller_ratings WHERE seller_id = ?',
      [sellerId]
    );
    return rows[0] || { avg_rating: null, review_count: 0 };
  },
};

module.exports = Review;
