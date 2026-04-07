const db = require("../config/db");

exports.getServices = (callback) => {
  db.query("SELECT * FROM services", callback);
};

exports.addService = (data, callback) => {
  db.query(
    "INSERT INTO services (name, image) VALUES (?,?)",
    data,
    callback
  );
};