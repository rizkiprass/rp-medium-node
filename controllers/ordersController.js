const db_ecommerce = require('../db/db_ecommerce');
const response = require('../utils/response.js');
const { calculateTotalAmount } = require('../utils/helper.js');

function placeOrder(req, res) {
    const userId = req.user ? req.user.id : null;
  
    if (!userId) {
      return response(401, { error: 'Unauthorized' }, 'Unauthorized', res);
    }
  
    // Ambil item dari keranjang pengguna dengan informasi produk
    db_ecommerce.query(
      'SELECT Cart.CartID, Cart.CustomerID, Cart.ProductID, Cart.Quantity, Products.Price FROM Cart JOIN Products ON Cart.ProductID = Products.ProductID WHERE Cart.CustomerID = ?',
      [userId],
      (err, cartItems) => {
        if (err) {
          console.error('Error fetching cart items: ' + err.message);
          return response(500, null, 'Gagal mengambil data keranjang belanja', res);
        }
  
        // Proses item keranjang untuk membuat pesanan
        const totalAmount = calculateTotalAmount(cartItems);
  
        // Insert pesanan ke tabel Orders
        const orderData = {
          CustomerID: userId,
          OrderDate: new Date(),
          TotalAmount: totalAmount,
          PaymentMethod: 'Metode Pembayaran Default', // Gantilah dengan metode pembayaran yang sesuai
        };
  
        db_ecommerce.query('INSERT INTO Orders SET ?', orderData, (insertOrderErr, orderResult) => {
          if (insertOrderErr) {
            console.error('Error inserting order: ' + insertOrderErr.message);
            return response(500, null, 'Gagal membuat pesanan', res);
          }
  
          const orderId = orderResult.insertId;
  
          // Insert detail pesanan ke tabel OrderDetails
          const orderDetailsData = cartItems.map(cartItem => {
            return {
              OrderID: orderId,
              ProductID: cartItem.ProductID,
              Quantity: cartItem.Quantity,
              Subtotal: cartItem.Quantity * cartItem.Price,
            };
          });
  
          db_ecommerce.query(
            'INSERT INTO OrderDetails (OrderID, ProductID, Quantity, Subtotal) VALUES ?',
            [orderDetailsData.map(item => [item.OrderID, item.ProductID, item.Quantity, item.Subtotal])],
            (insertDetailsErr) => {
              if (insertDetailsErr) {
                console.error('Error inserting order details: ' + insertDetailsErr.message);
                return response(500, null, 'Gagal membuat detail pesanan', res);
              }
  
              // Hapus item dari keranjang
              db_ecommerce.query('DELETE FROM Cart WHERE CustomerID = ?', [userId], (deleteErr) => {
                if (deleteErr) {
                  console.error('Error deleting cart items: ' + deleteErr.message);
                  return response(500, null, 'Gagal menghapus item dari keranjang', res);
                }
  
                return response(200, { message: 'Pesanan berhasil ditempatkan' }, 'Pesanan berhasil ditempatkan', res);
              });
            }
          );
        });
      }
    );
  }
  
function getOrderHistory(req, res) {
  const userId = req.user ? req.user.id : null;

  if (!userId) {
      return response(401, { error: 'Unauthorized' }, 'Unauthorized', res);
  }

  // Ambil riwayat pesanan pengguna dari database
  db_ecommerce.query('SELECT * FROM Orders WHERE CustomerID = ?', [userId], (err, orderHistory) => {
      if (err) {
          console.error('Error fetching order history: ' + err.message);
          return response(500, null, 'Gagal mengambil riwayat pesanan', res);
      }

      return response(200, orderHistory, 'Riwayat pesanan berhasil diambil', res);
  });
}

module.exports = {
  placeOrder,
  getOrderHistory
};
