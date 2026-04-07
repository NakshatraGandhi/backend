const db = require("../config/db");

exports.addReview = (data, callback) => {
  db.query(
    "INSERT INTO reviews (shop_id, user_id, rating, comment) VALUES (?,?,?,?)",
    data,
    callback
  );
};

exports.getReviewsByShop = (shop_id, callback) => {
  db.query(
    `SELECT r.*, u.name as user_name 
     FROM reviews r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.shop_id=? 
     ORDER BY r.created_at DESC`,
    [shop_id],
    callback
  );
};

exports.updateShopRating = (shop_id, callback) => {
  db.query(
    `UPDATE shops SET 
      rating = (SELECT AVG(rating) FROM reviews WHERE shop_id=?),
      total_reviews = (SELECT COUNT(*) FROM reviews WHERE shop_id=?)
     WHERE id=?`,
    [shop_id, shop_id, shop_id],
    callback
  );
};