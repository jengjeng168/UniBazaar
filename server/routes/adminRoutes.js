const express          = require('express');
const router           = express.Router();
const adminController  = require('../controllers/adminController');
const { authenticate, adminOnly } = require('../middlewares/authMiddleware');

// All admin routes require authentication + admin role
router.use(authenticate, adminOnly);

router.get('/stats',                  adminController.getStats);
router.get('/users',                  adminController.getUsers);
router.patch('/users/:id/ban',        adminController.banUser);
router.patch('/users/:id/unban',      adminController.unbanUser);
router.get('/products',               adminController.getAllProducts);
router.delete('/products/:id',        adminController.deleteProduct);

module.exports = router;
