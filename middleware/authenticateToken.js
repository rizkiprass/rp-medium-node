const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Tidak ada token, autentikasi gagal.' });
  }

  jwt.verify(token, 'rahasia-super-rahasia', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid.' });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;