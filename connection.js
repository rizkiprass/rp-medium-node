const mysql = require("mysql");

const db = mysql.createConnection({
  host: "sandbox-mysql.cnbvaslh13te.us-east-1.rds.amazonaws.com",
  user: "master",
  password: "Uk<i>Tmv[$CX}5~}wrDkKE+9A|q|",
  database: "mydb",
});

module.exports = db;
