const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');

// Your multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where the image will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File naming
  },
});

const upload = multer({ storage: storage });

router.get('/', authenticateToken, productsController.getAllProducts);
router.get('/:id', authenticateToken, productsController.getProductById);

// Use upload middleware for 'add' route to handle file uploads
router.post('/add', authenticateToken, upload.single('image'), productsController.addProduct);

router.delete('/delete/:id', authenticateToken, productsController.deleteProduct);
router.put('/:id', authenticateToken, productsController.updateProductById);

module.exports = router;
