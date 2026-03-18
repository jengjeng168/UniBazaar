const Review = require('../models/Review');
const User   = require('../models/User');

// GET /api/reviews/seller/:sellerId
async function getSellerReviews(req, res) {
  try {
    const seller = await User.findById(req.params.sellerId);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    const [reviews, stats] = await Promise.all([
      Review.getBySeller(req.params.sellerId),
      Review.getAverageRating(req.params.sellerId),
    ]);

    res.json({ reviews, ...stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/reviews/seller/:sellerId
async function createReview(req, res) {
  try {
    const sellerId    = parseInt(req.params.sellerId);
    const reviewerId  = req.user.id;

    if (sellerId === reviewerId) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    const seller = await User.findById(sellerId);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    const already = await Review.exists(sellerId, reviewerId);
    if (already) {
      return res.status(409).json({ message: 'You have already reviewed this seller' });
    }

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    await Review.create({ seller_id: sellerId, reviewer_id: reviewerId, rating, comment });

    const stats = await Review.getAverageRating(sellerId);
    res.status(201).json({ message: 'Review submitted', ...stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getSellerReviews, createReview };
