require('dotenv').config();

const mysql = require('mysql2') //use mysql2 to run the db mysql at container local docker

const db_ecommerce = mysql.createConnection({
    host: process.env.DB_ENDPOINT,
    user: "app",
    password: process.env.DB_PASS,
    database: "tp_db", //change
  });
  module.exports = db_ecommerce;