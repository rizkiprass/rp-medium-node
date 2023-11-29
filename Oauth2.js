// // const passport = require('passport');
// // const LocalStrategy = require('passport-local').Strategy;
// // const session = require('express-session');
// const bcrypt = require('bcryptjs');

// app.post('/register', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
  
//     // Hashing kata sandi sebelum menyimpannya ke basis data.
//     bcrypt.hash(password, 10, (err, hash) => {
//       if (err) {
//         res.send('Error occurred while registering.');
//       } else {
//         // Simpan informasi pengguna ke dalam database MySQL.
//         const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
//         const values = [email, hash];
  
//         db_ecommerce.query(insertQuery, values, (error, results) => {
//           if (error) {
//             console.error('Error while registering user:', error);
//             res.send('Error occurred while registering.');
//           } else {
//             res.send(`User ${email} is registered.`);
//           }
//         });
//       }
//     });
//   });