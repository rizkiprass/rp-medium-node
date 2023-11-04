const db_ecommerce = require('../db/db_ecommerce');
const response = require('../utils/response.js');

function getAllProducts(req, res) {
  db_ecommerce.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products: ' + err.message);
      response(500, null, 'Gagal mengambil data produk', res);
    } else {
      response(200, results, 'Data produk berhasil diambil', res);
    }
  });
}


function addProduct(req, res) {
    const { name, price } = req.body;
  
    // Check if a file was uploaded
    const image = req.file ? req.file.filename : null; // Set to null if no file was uploaded
  
    const newProduct = { name, price, image };
  
    db_ecommerce.query('INSERT INTO products SET ?', newProduct, (err, result) => {
      if (err) {
        console.error('Error inserting product: ' + err.message);
        response(500, { error: 'Gagal menambahkan produk' }, 'Gagal menambahkan produk', res);
      } else {
        console.log('Produk berhasil ditambahkan');
        response(201, { message: 'Produk berhasil ditambahkan' }, 'Produk berhasil ditambahkan', res);
      }
    });
  }


  function deleteProduct(req, res) {
    const productId = req.params.id;
  
    db_ecommerce.query('DELETE FROM products WHERE id = ?', productId, (err, result) => {
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
  
    db_ecommerce.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
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
    const { name, price } = req.body;
    const updatedProduct = { name, price };
  
    db_ecommerce.query('UPDATE products SET ? WHERE id = ?', [updatedProduct, productId], (err, result) => {
      if (err) {
        console.error('Error updating product: ' + err.message);
        response(500, null, 'Gagal mengupdate produk', res);
      } else if (result.affectedRows === 0) {
        response(404, null, 'Produk tidak ditemukan', res);
      } else {
        console.log('Produk berhasil diupdate');
        response(200, null, 'Produk berhasil diupdate', res);
      }
    });
  }
  

module.exports = {
  getAllProducts, addProduct, deleteProduct, getProductById, updateProductById
};