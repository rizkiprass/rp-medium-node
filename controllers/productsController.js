const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');
const db_ecommerce = require('../db/db_ecommerce');
const response = require('../utils/response.js');
const uploadMiddleware = require('../middleware/multerMiddleware.js');
const setCacheControl = require('../middleware/cacheControlMiddleware.js');
require('dotenv').config();

function getAllProducts(req, res) {
  // Use setCacheControl middleware before sending the response
  setCacheControl(req, res, async () => {
    try {
      // Get a connection from the pool
      const connection = await db_ecommerce.getConnection();

      // Use the connection to query the database
      const results = await connection.query('SELECT * FROM Products');

      // Release the connection back to the pool
      connection.release();

      response(200, results[0], 'Data produk berhasil diambil', res);
    } catch (err) {
      console.error('Error fetching products: ' + err.message);
      response(500, null, 'Gagal mengambil data produk', res);
    }
  });
}

async function addProduct(req, res) {
  try {
    // Use the multer middleware here
    await uploadMiddleware(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error('MulterError:', err);
        response(500, { error: 'Error uploading file' }, 'Error uploading file', res);
        return;
      } else if (err) {
        console.error('Upload error:', err);
        response(500, { error: err.message }, err.message, res);
        return;
      }

      const { ProductName, Description, Price, StockQuantity, CategoryID } = req.body;
      const image = req.file ? req.file.location : null;

      if (!ProductName || ProductName.trim() === "") {
        response(400, { error: 'ProductName cannot be null or empty' }, 'ProductName cannot be null or empty', res);
        return;
      }

      const newProduct = { ProductName, Description, Price, StockQuantity, CategoryID, Image: image };

      // Insert product into the database
      const result = await db_ecommerce.query('INSERT INTO Products SET ?', newProduct);

      console.log('Product added successfully');
      response(201, { message: 'Product added successfully' }, 'Product added successfully', res);
    });
  } catch (err) {
    console.error('Error adding product:', err.message);
    response(500, { error: 'Failed to add the product' }, 'Failed to add the product', res);
  }
}


function deleteProduct(req, res) {
  const productId = req.params.id;

  db_ecommerce.query('DELETE FROM Products WHERE ProductID = ?', productId, (err, result) => {
    if (err) {
      console.error('Error deleting product: ' + err.message);
      response(500, null, 'Gagal menghapus produk', res);
    } else {
      if (result.affectedRows === 0) {
        response(404, null, 'Produk tidak ditemukan', res);
      } else {
        console.log('Produk berhasil dihapus');
        response(200, null, 'Produk berhasil dihapus', res);
      }
    }
  });
}

function getProductById(req, res) {
  const productId = req.params.id;

  db_ecommerce.query('SELECT * FROM Products WHERE ProductID = ?', [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product: ' + err.message);
      response(500, null, 'Gagal mengambil data produk', res);
    } else if (results.length === 0) {
      response(404, null, 'Produk tidak ditemukan', res);
    } else {
      response(200, results[0], 'Data produk berhasil diambil', res);
    }
  });
}

function updateProductById(req, res) {
  const productId = req.params.id;
  const { ProductName, Description, Price, StockQuantity, CategoryID } = req.body;

  // Check if req.file exists to determine whether to update the Image column
  const updatedProduct = {
    ProductName: ProductName || null,
    Description: Description || null,
    Price: Price || null,
    StockQuantity: StockQuantity || null,
    CategoryID: CategoryID || null,
  };

  if (req.file) {
    updatedProduct.Image = req.file.filename;
  } else {
    // If no new image is provided, you should still send the existing image filename or an empty string
    // Adjust this part based on your database structure
    updatedProduct.Image = ''; // Change this line based on your actual structure
  }

  db_ecommerce.query('UPDATE Products SET ? WHERE ProductID = ?', [updatedProduct, productId], (err, result) => {
    if (err) {
      console.error('Error updating product: ' + err.message);
      response(500, null, 'Failed to update the product', res);
    } else if (result.affectedRows === 0) {
      response(404, null, 'Product not found', res);
    } else {
      console.log('Product updated successfully');
      response(200, null, 'Product updated successfully', res);
    }
  });
}



module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
  getProductById,
  updateProductById
};
