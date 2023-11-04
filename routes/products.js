const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const authenticateToken = require('../middleware/authenticateToken'); // Import your authentication logic

router.get('/', authenticateToken, productsController.getAllProducts);
router.get('/:id', productsController.getProductById);

router.post('/add', productsController.addProduct);

router.delete('/delete/:id', productsController.deleteProduct);

router.put('/:id', productsController.updateProductById);


module.exports = router;