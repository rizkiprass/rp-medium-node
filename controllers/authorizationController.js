const bcrypt = require('bcrypt');
const db_ecommerce = require('../db/db_ecommerce');
const response = require('../utils/response');

const saltRounds = 10;

function registerUser(req, res) {
  const { email, password } = req.body;

  // Hash password before storing it in the database
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Gagal menghash password: ' + err);
      response(500, null, 'Terjadi kesalahan saat registrasi', res); // Pass `res` as an argument
    } else {
      const user = { email, password: hash };
      db_ecommerce.query('INSERT INTO users SET ?', user, (error, results) => {
        if (error) {
          console.error('Gagal menyimpan data ke database: ' + error);
          response(500, null, 'Terjadi kesalahan saat registrasi', res); // Pass `res` as an argument
        } else {
          response(201, null, 'Registrasi berhasil!', res); // Pass `res` as an argument
        }
      });
    }
  });
}

const jwt = require('jsonwebtoken')

function loginUser(req, res) {
    const { email, password } = req.body;
  
    db_ecommerce.query('SELECT * FROM users WHERE email = ?', email, (error, results) => {
      if (error) {
        console.error('Gagal mengambil data dari database: ' + error);
        response(500, null, 'Terjadi kesalahan saat login.', res);
      } else if (results.length > 0) {
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            // Buat access token
            const accessToken = jwt.sign({ email: user.email, id: user.id }, 'rahasia-super-rahasia', { expiresIn: '1h' });
  
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
  registerUser, loginUser
};
