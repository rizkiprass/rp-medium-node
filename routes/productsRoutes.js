const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const authenticateToken = require('../middleware/authenticateToken');


router.get('/', productsController.getAllProducts);
router.get('/:id', authenticateToken, productsController.getProductById);

router.post('/add', authenticateToken, productsController.addProduct)

router.delete('/delete/:id', authenticateToken, productsController.deleteProduct);
router.put('/:id', authenticateToken, productsController.updateProductById);

module.exports = router;
