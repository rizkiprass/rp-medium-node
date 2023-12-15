const express = require('express');
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Route for adding product to cart
router.post('/add', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getCart);
router.put('/update', authenticateToken, cartController.updateCartItem);
router.delete('/delete/:id', authenticateToken, cartController.deleteCartItem);

// Route for getting a specific cart item by ID
router.get('/:id', authenticateToken, cartController.getCartItemById);

module.exports = router;
