const express = require('express');
const ordersDetailsController = require('../controllers/ordersDetailsController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/addOrderDetail', authenticateToken, ordersDetailsController.addOrderDetail);
router.get('/getOrderDetailsByOrder/:orderId', authenticateToken, ordersDetailsController.getOrderDetailsByOrder);

module.exports = router;
