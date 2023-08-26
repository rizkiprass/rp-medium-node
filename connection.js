const mysql = require("mysql");

const db = mysql.createConnection({
  host: "pras-rds-mysql.cvlat54zdajk.eu-west-3.rds.amazonaws.com",
  user: "admin",
  password: "admin123!",
  database: "mydb",
});

module.exports = db;
