const db = require("../config/db");

exports.addFavourite = (data, callback) => {
  db.query(
    "INSERT IGNORE INTO favourites (user_id, shop_id) VALUES (?,?)",
    data,
    callback
  );
};

exports.removeFavourite = (user_id, shop_id, callback) => {
  db.query(
    "DELETE FROM favourites WHERE user_id=? AND shop_id=?",
    [user_id, shop_id],
    callback
  );
};

exports.getFavourites = (user_id, callback) => {
  db.query(
    `SELECT s.*, 
      (6371 * ACOS(COS(RADIANS(0)) * COS(RADIANS(s.latitude)) *
      COS(RADIANS(s.longitude) - RADIANS(0)) +
      SIN(RADIANS(0)) * SIN(RADIANS(s.latitude)))) AS distance
     FROM favourites f
     JOIN shops s ON f.shop_id = s.id
     WHERE f.user_id=?`,
    [user_id],
    callback
  );
};

exports.isFavourite = (user_id, shop_id, callback) => {
  db.query(
    "SELECT * FROM favourites WHERE user_id=? AND shop_id=?",
    [user_id, shop_id],
    callback
  );
};