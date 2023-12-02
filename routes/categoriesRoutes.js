const express = require('express');
const categoriesController = require('../controllers/categoriesController');
const authenticateToken = require('../middleware/authenticateToken'); // If authentication is required

const router = express.Router();

// Route to get all categories
router.get('/', categoriesController.getAllCategories);

// Route to add a new category
router.post('/add', authenticateToken, categoriesController.addCategory);

// Route to delete a category by ID
router.delete('/delete/:id', authenticateToken, categoriesController.deleteCategoryById);

module.exports = router;
