const express = require("express");
const app = express();
const cors = require("cors"); // Import the cors package
const db = require("./connection");

app.use(cors()); // Use the cors middleware

const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.get("/db", (req, res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, result) => {
    console.log(result);

    response(200, result, "get all data from user", res);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
