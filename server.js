const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./connection.js");
const db_ecommerce = require("./connection2");
const response = require("./response");
const multer = require("multer");

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const port = 8080;

// Konfigurasi multer untuk menyimpan file di folder tertentu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder tempat gambar akan disimpan
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nama file yang disimpan
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

//response.js format dari dea afrizal
app.get("/api2", (req, res) => {
  response(200, ["userOne", "userTwo", "userThree"], "ini message", res);
});


app.get("/db", (req, res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: "Error querying the database" });
    } else {
      res.json(result);
    }
  });
});

// DB ecommerce
// [INSERT] Endpoint untuk menambahkan produk
app.post("/api/products", upload.single("image"), (req, res) => {
  const { name, price } = req.body;

  // Check if a file was uploaded
  const image = req.file ? req.file.filename : null; // Set to null if no file was uploaded

  const newProduct = { name, price, image };

  db_ecommerce.query("INSERT INTO products SET ?", newProduct, (err, result) => {
    if (err) {
      console.error("Error inserting product: " + err.message);
      // Menggunakan response.js untuk mengirim respon
      response(500, { error: "Gagal menambahkan produk" }, "Gagal menambahkan produk", res);
    } else {
      console.log("Produk berhasil ditambahkan");
      // Menggunakan response.js untuk mengirim respon
      response(201, { message: "Produk berhasil ditambahkan" }, "Produk berhasil ditambahkan", res);
    }
  });
});



// [GET] Endpoint untuk mendapatkan semua produk yang memerlukan otentikasi
app.get('/api/products', authenticateToken, (req, res) => {
  db_ecommerce.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products: ' + err.message);
      // Menggunakan response.js untuk mengirim respon
      response(500, null, 'Gagal mengambil data produk', res);
    } else {
      // Menggunakan response.js untuk mengirim respon
      response(200, results, 'Data produk berhasil diambil', res);
    }
  });
});


// [GET] Endpoint to get a single product by ID
app.get('/api/products/:productId', (req, res) => {
  const productId = req.params.productId; // Dapatkan ID produk dari parameter URL

  // Query the database to retrieve the product with the specified ID
  db_ecommerce.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product: ' + err.message);
      response(500, null, 'Gagal mengambil data produk', res);
      return;
    }

    if (results.length === 0) {
      // Jika tidak ada produk dengan ID yang ditentukan, kirim respons 404 Not Found
      response(404, null, 'Produk tidak ditemukan', res);
    } else {
      // Jika produk dengan ID yang ditentukan ditemukan, kirimnya sebagai JSON
      response(200, results[0], 'Data produk berhasil diambil', res);
    }
  });
});


// [DELETE] Endpoint untuk menghapus produk berdasarkan ID
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  db_ecommerce.query('DELETE FROM products WHERE id = ?', productId, (err, result) => {
    if (err) {
      console.error('Error deleting product: ' + err.message);
      response(500, null, 'Gagal menghapus produk', res);
      return;
    }

    if (result.affectedRows === 0) {
      response(404, null, 'Produk tidak ditemukan', res);
      return;
    }

    console.log('Produk berhasil dihapus');
    response(200, null, 'Produk berhasil dihapus', res);
  });
});

// [PUT] Endpoint untuk mengupdate produk berdasarkan ID
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price } = req.body;
  const updatedProduct = { name, price };

  db_ecommerce.query('UPDATE products SET ? WHERE id = ?', [updatedProduct, productId], (err, result) => {
    if (err) {
      console.error('Error updating product: ' + err.message);
      response(500, null, 'Gagal mengupdate produk', res);
      return;
    }

    if (result.affectedRows === 0) {
      response(404, null, 'Produk tidak ditemukan', res);
      return;
    }

    console.log('Produk berhasil diupdate');
    response(200, null, 'Produk berhasil diupdate', res);
  });
});


//////////////////////////////////////////////////////////
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Endpoint untuk registrasi
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Hash password sebelum menyimpannya di database
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Gagal menghash password: ' + err);
      res.status(500).send('Terjadi kesalahan saat registrasi.');
    } else {
      const user = { email, password: hash };
      db_ecommerce.query('INSERT INTO users SET ?', user, (error, results) => {
        if (error) {
          console.error('Gagal menyimpan data ke database: ' + error);
          res.status(500).send('Terjadi kesalahan saat registrasi.');
        } else {
          res.status(201).send('Registrasi berhasil!');
        }
      });
    }
  });
});

const jwt = require('jsonwebtoken');

// Endpoint untuk login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db_ecommerce.query('SELECT * FROM users WHERE email = ?', email, (error, results) => {
    if (error) {
      console.error('Gagal mengambil data dari database: ' + error);
      res.status(500).send('Terjadi kesalahan saat login.');
    } else if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          // Buat access token
          const accessToken = jwt.sign({ email: user.email, id: user.id }, 'rahasia-super-rahasia', { expiresIn: '1h' });

          res.json({ accessToken });
        } else {
          res.status(401).send('Kombinasi email dan password tidak valid.');
        }
      });
    } else {
      res.status(401).send('Kombinasi email dan password tidak valid.');
    }
  });
});

// Middleware untuk memeriksa access token
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
