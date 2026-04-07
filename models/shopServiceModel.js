const db = require("../config/db");

exports.addShopService = (data, callback) => {
  db.query(
    "INSERT INTO shop_services (shop_id, name, price, duration_mins, category) VALUES (?,?,?,?,?)",
    data,
    callback
  );
};

exports.getShopServices = (shop_id, callback) => {
  db.query(
    "SELECT * FROM shop_services WHERE shop_id=?",
    [shop_id],
    callback
  );
};

exports.deleteShopService = (id, callback) => {
  db.query("DELETE FROM shop_services WHERE id=?", [id], callback);
};