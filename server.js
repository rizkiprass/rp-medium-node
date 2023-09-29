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
  const image = req.file.filename; // Nama file gambar yang diunggah

  const newProduct = { name, price, image };

  db_ecommerce.query("INSERT INTO products SET ?", newProduct, (err, result) => {
    if (err) {
      console.error("Error inserting product: " + err.message);
      res.status(500).json({ error: "Gagal menambahkan produk" });
      return;
    }
    console.log("Produk berhasil ditambahkan");
    res.status(201).json({ message: "Produk berhasil ditambahkan" });
  });
});


// [GET] Endpoint untuk mendapatkan semua produk
app.get('/api/products', (req, res) => {
  db_ecommerce.query('SELECT * FROM products', (err, results) => {
      if (err) {
          console.error('Error fetching products: ' + err.message);
          res.status(500).json({ error: 'Gagal mengambil data produk' });
          return;
      }
      res.status(200).json(results);
  });
});

// [GET] Endpoint to get a single product by ID
app.get('/api/products/:productId', (req, res) => {
  const productId = req.params.productId; // Get the product ID from the URL parameter

  // Query the database to retrieve the product with the specified ID
  db_ecommerce.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product: ' + err.message);
      res.status(500).json({ error: 'Gagal mengambil data produk' });
      return;
    }

    if (results.length === 0) {
      // If no product with the specified ID is found, return a 404 Not Found response
      res.status(404).json({ error: 'Produk tidak ditemukan' });
    } else {
      // If a product with the specified ID is found, return it as JSON
      res.status(200).json(results[0]);
    }
  });
});

// [DELETE] Endpoint untuk menghapus produk berdasarkan ID
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  db_ecommerce.query('DELETE FROM products WHERE id = ?', productId, (err, result) => {
      if (err) {
          console.error('Error deleting product: ' + err.message);
          res.status(500).json({ error: 'Gagal menghapus produk' });
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Produk tidak ditemukan' });
          return;
      }

      console.log('Produk berhasil dihapus');
      res.status(200).json({ message: 'Produk berhasil dihapus' });
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
          res.status(500).json({ error: 'Gagal mengupdate produk' });
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Produk tidak ditemukan' });
          return;
      }

      console.log('Produk berhasil diupdate');
      res.status(200).json({ message: 'Produk berhasil diupdate' });
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
