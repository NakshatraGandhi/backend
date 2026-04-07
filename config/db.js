const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookzen",
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("DB Connected");
});

module.exports = db;