const db_ecommerce = require('../db/db_ecommerce');
const response = require('../utils/response.js');

// Get all categories
function getAllCategories(req, res) {
  db_ecommerce.query('SELECT * FROM Categories', (err, results) => {
    if (err) {
      console.error('Error fetching categories: ' + err.message);
      response(500, null, 'Failed to fetch categories', res);
    } else {
      response(200, results, 'Categories data retrieved successfully', res);
    }
  });
}

// Add a new category
function addCategory(req, res) {
  const { categoryName } = req.body;

  // Validate input
  if (!categoryName || categoryName.trim() === "") {
    response(400, { error: 'Category name cannot be null or empty' }, 'Invalid input', res);
  } else {
    const newCategory = { CategoryName: categoryName };

    db_ecommerce.query('INSERT INTO Categories SET ?', newCategory, (err, result) => {
      if (err) {
        console.error('Error inserting category: ' + err.message);
        response(500, { error: 'Failed to add category' }, 'Failed to add category', res);
      } else {
        console.log('Category added successfully');
        response(201, { message: 'Category added successfully' }, 'Category added successfully', res);
      }
    });
  }
}

// Delete a category by ID
function deleteCategoryById(req, res) {
  const categoryId = req.params.id;

  db_ecommerce.query('DELETE FROM Categories WHERE CategoryID = ?', categoryId, (err, result) => {
    if (err) {
      console.error('Error deleting category: ' + err.message);
      response(500, null, 'Failed to delete category', res);
    } else {
      if (result.affectedRows === 0) {
        response(404, null, 'Category not found', res);
      } else {
        console.log('Category deleted successfully');
        response(200, null, 'Category deleted successfully', res);
      }
    }
  });
}

module.exports = {
  getAllCategories,
  addCategory,
  deleteCategoryById,
};
