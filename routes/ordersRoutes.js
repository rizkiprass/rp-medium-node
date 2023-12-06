const express = require('express');
const orderController = require('../controllers/ordersController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Endpoint untuk menempatkan pesanan
router.post('/placeOrder', authenticateToken, orderController.placeOrder);

// Endpoint untuk mendapatkan riwayat pesanan pelanggan
router.get('/orderHistory', authenticateToken, orderController.getOrderHistory);

module.exports = router;
