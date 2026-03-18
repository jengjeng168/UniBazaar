const { pool } = require('../config/db');

const Product = {
  async getAll({ search = '', category = '', page = 1, limit = 12 } = {}) {
    const offset = (page - 1) * limit;
    const params = [];
    let where    = 'WHERE p.status = "available"';

    if (search) {
      where  += ' AND MATCH(p.title, p.description) AGAINST(? IN BOOLEAN MODE)';
      params.push(`${search}*`);
    }

    if (category) {
      where  += ' AND c.name = ?';
      params.push(category);
    }

    const baseQuery = `
      FROM products p
      JOIN users      u ON p.seller_id   = u.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN seller_ratings sr ON sr.seller_id = p.seller_id
      ${where}
    `;

    const [rows] = await pool.query(
      `SELECT p.*, u.username AS seller_name, c.name AS category_name,
              sr.avg_rating, sr.review_count
       ${baseQuery}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total ${baseQuery}`, params);

    return { rows, total, page, limit };
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, u.username AS seller_name, u.email AS seller_email,
              c.name AS category_name, sr.avg_rating, sr.review_count
       FROM products p
       JOIN users      u ON p.seller_id   = u.id
       JOIN categories c ON p.category_id = c.id
       LEFT JOIN seller_ratings sr ON sr.seller_id = p.seller_id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ seller_id, category_id, title, description, price, image }) {
    const [result] = await pool.query(
      'INSERT INTO products (seller_id, category_id, title, description, price, image) VALUES (?, ?, ?, ?, ?, ?)',
      [seller_id, category_id, title, description, price, image || null]
    );
    return result.insertId;
  },

  async update(id, { category_id, title, description, price, status, image }) {
    const fields = [];
    const values = [];

    if (category_id !== undefined) { fields.push('category_id = ?'); values.push(category_id); }
    if (title       !== undefined) { fields.push('title = ?');       values.push(title);       }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (price       !== undefined) { fields.push('price = ?');       values.push(price);       }
    if (status      !== undefined) { fields.push('status = ?');      values.push(status);      }
    if (image       !== undefined) { fields.push('image = ?');       values.push(image);       }

    if (!fields.length) return false;
    values.push(id);

    await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    return true;
  },

  async delete(id) {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  },

  async getBySellerId(sellerId) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.seller_id = ?
       ORDER BY p.created_at DESC`,
      [sellerId]
    );
    return rows;
  },

  async getCategories() {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    return rows;
  },
};

module.exports = Product;
