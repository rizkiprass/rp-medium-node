const mysql = require('mysql2') //use mysql2 to run the db mysql at container local docker

const db_ecommerce = mysql.createConnection({
    host: "localhost",
    user: "app",
    password: "app",
    database: "ecommerce_db",
  });
  module.exports = db_ecommerce;