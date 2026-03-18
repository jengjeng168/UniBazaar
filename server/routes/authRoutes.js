const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me  (protected)
router.get('/me', authenticate, authController.me);

module.exports = router;
