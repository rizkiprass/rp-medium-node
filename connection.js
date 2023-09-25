// const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "sandbox-mysql.cnbvaslh13te.us-east-1.rds.amazonaws.com",
//   user: "master",
//   password: "Uk<i>Tmv[$CX}5~}wrDkKE+9A|q|",
//   database: "mydb",
// });

// module.exports = db;

const mysql = require('mysql2') //use mysql2 to run the db mysql at container local docker

const db = mysql.createConnection({
  host: "localhost",
  user: "app",
  password: "app",
  database: "mydb",
});

module.exports = db;

//////////////////////////////////////////////////////////////
