const express = require('express');
const ordersController = require('../controllers/ordersController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Route to get all orders
// router.get('/', ordersController.getAllOrders);
router.get('/getOrdersByCustomer', authenticateToken, ordersController.getOrdersByCustomer);


// Route to add a new order
router.post('/add', authenticateToken, ordersController.addOrder);
module.exports = router;