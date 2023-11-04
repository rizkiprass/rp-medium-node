const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./connection.js");
const db_ecommerce = require("./connection2");
const response = require("./utils/response.js");
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





//new
const productsRoutes = require('./routes/products');
const authRoutes = require('./routes/auth.js');

app.use('/products', productsRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
