const bcrypt = require('bcrypt');
const db_ecommerce = require('../db/db_ecommerce');
const response = require('../utils/response');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

function registerUser(req, res) {
  const { FirstName, LastName, Email, Password, Address } = req.body;

  // Hash password before storing it in the database
  bcrypt.hash(Password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Gagal menghash password: ' + err);
      response(500, null, 'Terjadi kesalahan saat registrasi', res);
    } else {
      const customer = { FirstName, LastName, Email, Password: hash, Address };
      db_ecommerce.query('INSERT INTO Customers SET ?', customer, (error, results) => {
        if (error) {
          console.error('Gagal menyimpan data ke database: ' + error);
          response(500, null, 'Terjadi kesalahan saat registrasi', res);
        } else {
          response(201, null, 'Registrasi berhasil!', res);
        }
      });
    }
  });
}

function loginUser(req, res) {
  const { Email, Password } = req.body;

  db_ecommerce.query('SELECT * FROM Customers WHERE Email = ?', Email, (error, results) => {
    if (error) {
      console.error('Gagal mengambil data dari database: ' + error);
      response(500, null, 'Terjadi kesalahan saat login.', res);
    } else if (results.length > 0) {
      const customer = results[0];
      bcrypt.compare(Password, customer.Password, (err, result) => {
        if (result) {
          // Buat access token
          const accessToken = jwt.sign({ email: customer.Email, id: customer.CustomerID }, 'rahasia-super-rahasia', { expiresIn: '1h' });

          response(200, { accessToken }, 'Login berhasil', res);
        } else {
          response(401, null, 'Kombinasi email dan password tidak valid.', res);
        }
      });
    } else {
      response(401, null, 'Kombinasi email dan password tidak valid.', res);
    }
  });
}

module.exports = {
  registerUser,
  loginUser
};
