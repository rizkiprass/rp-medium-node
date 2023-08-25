const express = require("express");
const app = express();
const cors = require("cors"); // Import the cors package

app.use(cors()); // Use the cors middleware

const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.get("/api/data", (req, res) => {
  const data = { message: "Ini adalah data dari server Express!" };
  res.json(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
