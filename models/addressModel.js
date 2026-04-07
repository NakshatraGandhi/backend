const db = require("../config/db");

// Create new address
exports.createAddress = (data, callback) => {
  db.query(
    "INSERT INTO addresses (user_id, label, address_line, city, state, pincode, latitude, longitude) VALUES (?,?,?,?,?,?,?,?)",
    data,
    callback
  );
};

// Get all addresses for a user
exports.getAddressesByUser = (userId, callback) => {
  db.query("SELECT * FROM addresses WHERE user_id=?", [userId], callback);
};

// Delete an address
exports.deleteAddress = (id, callback) => {
  db.query("DELETE FROM addresses WHERE id=?", [id], callback);
};
