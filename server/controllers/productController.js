const Product = require('../models/Product');
const fs      = require('fs');
const path    = require('path');

// GET /api/products
async function getProducts(req, res) {
  try {
    const { search = '', category = '', page = 1, limit = 12 } = req.query;
    const result = await Product.getAll({
      search,
      category,
      page:  parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/products/categories
async function getCategories(req, res) {
  try {
    const categories = await Product.getCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/products/:id
async function getProduct(req, res) {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/products/seller/:sellerId
async function getSellerProducts(req, res) {
  try {
    const products = await Product.getBySellerId(req.params.sellerId);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/products
async function createProduct(req, res) {
  try {
    const { category_id, title, description, price } = req.body;

    if (!category_id || !title || !description || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const image = req.file ? req.file.filename : null;
    const id    = await Product.create({
      seller_id: req.user.id,
      category_id,
      title,
      description,
      price: parseFloat(price),
      image,
    });

    const product = await Product.getById(id);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/products/:id
async function updateProduct(req, res) {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only owner or admin may update
    if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { category_id, title, description, price, status } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Delete old image if a new one was uploaded
    if (image && product.image) {
      const oldPath = path.join(__dirname, '../uploads', product.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await Product.update(req.params.id, { category_id, title, description, price, status, image });

    const updated = await Product.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// DELETE /api/products/:id
async function deleteProduct(req, res) {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only owner or admin may delete
    if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove image file
    if (product.image) {
      const imgPath = path.join(__dirname, '../uploads', product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Product.delete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getProducts,
  getCategories,
  getProduct,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
