const db_ecommerce = require('../db/db_ecommerce');
const response = require('../utils/response.js');

function addToCart(req, res) {
    const { productId, quantity } = req.body;
  
    // Validasi input
    if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
        return response(400, { error: 'Invalid input' }, 'Invalid input', res);
    }
  
    // Mendapatkan ID pengguna dari objek otentikasi (jika Anda menggunakan otentikasi)
    const customerId = req.user ? req.user.id : null;
  
    if (!customerId) {
        return response(401, { error: 'Unauthorized' }, 'Unauthorized', res);
    }
  
    // Mendapatkan informasi produk dari database
    db_ecommerce.query('SELECT * FROM Products WHERE productId = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product: ' + err.message);
            return response(500, null, 'Gagal mengambil data produk', res);
        }
  
        if (results.length === 0) {
            return response(404, null, 'Produk tidak ditemukan', res);
        }
  
        const product = results[0];
  
        // Periksa apakah produk sudah ada di dalam keranjang pengguna
        db_ecommerce.query('SELECT * FROM Cart WHERE CustomerID = ? AND ProductID = ?', [customerId, productId], (err, cartResults) => {
            if (err) {
                console.error('Error fetching cart items: ' + err.message);
                return response(500, null, 'Gagal mengambil data keranjang belanja', res);
            }
  
            // Jika produk sudah ada di dalam keranjang, update quantity
            if (cartResults.length > 0) {
                const existingCartItem = cartResults[0];
                const updatedQuantity = existingCartItem.Quantity + quantity;
  
                // Update quantity produk di keranjang
                db_ecommerce.query('UPDATE Cart SET Quantity = ? WHERE CartID = ?', [updatedQuantity, existingCartItem.CartID], (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating cart item: ' + updateErr.message);
                        return response(500, null, 'Gagal mengupdate item keranjang belanja', res);
                    }
  
                    return response(200, { message: 'Quantity produk diupdate di keranjang belanja' }, 'Quantity produk diupdate di keranjang belanja', res);
                });
            } else {
                // Jika produk belum ada di dalam keranjang, tambahkan sebagai item baru
                const cartItem = {
                    CustomerID: customerId,
                    ProductID: product.ProductID,
                    Quantity: quantity,
                };
  
                // Tambahkan item baru ke keranjang
                db_ecommerce.query('INSERT INTO Cart SET ?', cartItem, (insertErr) => {
                    if (insertErr) {
                        console.error('Error adding to cart: ' + insertErr.message);
                        return response(500, { error: 'Gagal menambahkan produk ke keranjang' }, 'Gagal menambahkan produk ke keranjang', res);
                    }
  
                    return response(201, { message: 'Produk berhasil ditambahkan ke keranjang belanja' }, 'Produk berhasil ditambahkan ke keranjang belanja', res);
                });
            }
        });
    });
}

function getCart(req, res) {
    // Mendapatkan ID pengguna dari objek otentikasi (jika Anda menggunakan otentikasi)
    const customerId = req.user ? req.user.id : null;

    if (!customerId) {
        return response(401, { error: 'Unauthorized' }, 'Unauthorized', res);
    }

    // Menggabungkan tabel Cart dan Products untuk mendapatkan detail produk
    const query = `
        SELECT 
            Cart.CartID,
            Cart.CustomerID,
            Cart.ProductID,
            Cart.Quantity,
            Products.ProductName,
            Products.Description,
            Products.Price,
            Products.StockQuantity,
            Products.CategoryID,
            Products.Image
        FROM Cart
        INNER JOIN Products ON Cart.ProductID = Products.ProductID
        WHERE Cart.CustomerID = ?`;

    db_ecommerce.query(query, [customerId], (err, results) => {
        if (err) {
            console.error('Error fetching cart items: ' + err.message);
            return response(500, null, 'Gagal mengambil data keranjang belanja', res);
        }

        return response(200, results, 'Data keranjang belanja berhasil diambil', res);
    });
}

function updateCartItem(req, res) {
    const { cartItemId, quantity } = req.body;

    // Validasi input
    if (!cartItemId || !quantity || isNaN(quantity) || quantity <= 0) {
        return response(400, { error: 'Invalid input' }, 'Invalid input', res);
    }

    // Mendapatkan ID pengguna dari objek otentikasi (jika Anda menggunakan otentikasi)
    const customerId = req.user ? req.user.id : null;

    if (!customerId) {
        return response(401, { error: 'Unauthorized' }, 'Unauthorized', res);
    }

    // Update item di keranjang belanja pengguna (contoh: menggunakan sesi atau database)
    db_ecommerce.query('UPDATE Cart SET Quantity = ? WHERE CartID = ? AND CustomerID = ?', [quantity, cartItemId, customerId], (err, result) => {
        if (err) {
            console.error('Error updating cart item: ' + err.message);
            return response(500, { error: 'Gagal mengupdate produk di keranjang' }, 'Gagal mengupdate produk di keranjang', res);
        }

        if (result.affectedRows === 0) {
            return response(404, { error: 'Item in cart not found' }, 'Item in cart not found', res);
        }

        return response(200, { message: 'Produk di keranjang berhasil diupdate' }, 'Produk di keranjang berhasil diupdate', res);
    });
}

function deleteCartItem(req, res) {
    const { id } = req.params; // Use req.params to get the parameters from the URL

    // Validasi input
    if (!id) {
        return response(400, { error: 'Invalid input' }, 'Invalid input', res);
    }

    // Mendapatkan ID pengguna dari objek otentikasi (jika Anda menggunakan otentikasi)
    const customerId = req.user ? req.user.id : null;

    if (!customerId) {
        return response(401, { error: 'Unauthorized' }, 'Unauthorized', res);
    }

    // Hapus item dari keranjang belanja pengguna (contoh: menggunakan sesi atau database)
    db_ecommerce.query('DELETE FROM Cart WHERE CartID = ? AND CustomerID = ?', [id, customerId], (err, result) => {
        if (err) {
            console.error('Error deleting cart item: ' + err.message);
            return response(500, { error: 'Gagal menghapus produk dari keranjang' }, 'Gagal menghapus produk dari keranjang', res);
        }

        if (result.affectedRows === 0) {
            return response(404, { error: 'Item in cart not found' }, 'Item in cart not found', res);
        }

        return response(200, { message: 'Produk di keranjang berhasil dihapus' }, 'Produk di keranjang berhasil dihapus', res);
    });
}

module.exports = {
    addToCart, getCart, updateCartItem, deleteCartItem
};
