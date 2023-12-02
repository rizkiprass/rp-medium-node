const db_ecommerce = require('../db/db_ecommerce');
const response = require('../utils/response');

function addOrderDetail(req, res) {
  const { orderId, productId, quantity, subtotal } = req.body;

  const orderDetail = { orderId, productId, quantity, subtotal };

  db_ecommerce.query('INSERT INTO OrderDetails SET ?', orderDetail, (err, result) => {
    if (err) {
      console.error('Error adding order detail: ' + err.message);
      return response(500, { error: 'Gagal menambahkan detail pesanan' }, 'Gagal menambahkan detail pesanan', res);
    } else {
      return response(201, { message: 'Detail pesanan berhasil ditambahkan' }, 'Detail pesanan berhasil ditambahkan', res);
    }
  });
}

function getOrderDetailsByOrder(req, res) {
  const orderId = req.params.orderId;

  db_ecommerce.query('SELECT * FROM OrderDetails WHERE OrderID = ?', orderId, (err, results) => {
    if (err) {
      console.error('Error fetching order details: ' + err.message);
      return response(500, null, 'Gagal mengambil detail pesanan', res);
    } else {
      return response(200, results, 'Data detail pesanan berhasil diambil', res);
    }
  });
}

module.exports = {
  addOrderDetail,
  getOrderDetailsByOrder
};
