const express           = require('express');
const router            = express.Router();
const reviewController  = require('../controllers/reviewController');
const { authenticate }  = require('../middlewares/authMiddleware');

// GET  /api/reviews/seller/:sellerId — public
router.get('/seller/:sellerId', reviewController.getSellerReviews);

// POST /api/reviews/seller/:sellerId — protected
router.post('/seller/:sellerId', authenticate, reviewController.createReview);

module.exports = router;
