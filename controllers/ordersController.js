const db_ecommerce = require('../db/db_ecommerce');
const response = require('../utils/response.js');

function getOrdersByCustomer(req, res) {
    const userId = req.user ? req.user.id : null;
  
    if (!userId) {
      return response(401, { error: 'Unauthorized' }, 'Unauthorized', res);
    }
  
    db_ecommerce.query('SELECT * FROM Orders WHERE CustomerID = ?', userId, (err, results) => {
      if (err) {
        console.error('Error fetching orders: ' + err.message);
        return response(500, null, 'Gagal mengambil data pesanan', res);
      } else {
        return response(200, results, 'Data pesanan berhasil diambil', res);
      }
    });
  }

function addOrder(req, res) {
  const { customerId, orderDate, totalAmount, paymentMethod } = req.body;

  if (!customerId || !orderDate || !totalAmount || !paymentMethod) {
    response(400, { error: 'Invalid input' }, 'Invalid input', res);
  } else {
    const newOrder = {
      CustomerID: customerId,
      OrderDate: orderDate,
      TotalAmount: totalAmount,
      PaymentMethod: paymentMethod
    };

    db_ecommerce.query('INSERT INTO Orders SET ?', newOrder, (err, result) => {
      if (err) {
        console.error('Error adding order: ' + err.message);
        response(500, { error: 'Failed to add order' }, 'Failed to add order', res);
      } else {
        console.log('Order added successfully');
        response(201, { message: 'Order added successfully' }, 'Order added successfully', res);
      }
    });
  }
}

module.exports = {
    getOrdersByCustomer,
  addOrder
};