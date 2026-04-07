const db = require("../config/db");

exports.createOrder = (data, callback) => {
  db.query(
    "INSERT INTO orders (user_id, shop_id, details, status) VALUES (?,?,?,?)",
    data,
    callback
  );
};

exports.getOrdersByUser = (user_id, callback) => {
  db.query(
    "SELECT * FROM orders WHERE user_id=?",
    [user_id],
    callback
  );
};

exports.updateOrderStatus = (data, callback) => {
  db.query(
    "UPDATE orders SET status=? WHERE id=?",
    data,
    callback
  );
};