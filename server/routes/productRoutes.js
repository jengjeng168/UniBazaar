const express           = require('express');
const router            = express.Router();
const productController = require('../controllers/productController');
const { authenticate }  = require('../middlewares/authMiddleware');
const upload            = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/',                         productController.getProducts);
router.get('/categories',               productController.getCategories);
router.get('/seller/:sellerId',         productController.getSellerProducts);
router.get('/:id',                      productController.getProduct);

// Protected routes
router.post('/',   authenticate, upload.single('image'), productController.createProduct);
router.put('/:id', authenticate, upload.single('image'), productController.updateProduct);
router.delete('/:id', authenticate,                      productController.deleteProduct);

module.exports = router;
