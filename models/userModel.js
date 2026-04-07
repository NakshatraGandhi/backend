const db = require("../config/db");

exports.createUser = (values, callback) => {
  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    values,
    callback
  );
};


exports.findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email=?", [email], callback);
};

exports.findUserById = (id, callback) => {
  db.query("SELECT * FROM users WHERE id=?", [id], callback);
};

exports.updateUser = (data, callback) => {
  db.query(
    "UPDATE users SET name=?, phone=?, profile_image=? WHERE id=?",
    data,
    callback
  );
};