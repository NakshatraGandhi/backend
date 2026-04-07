const reviewModel = require("../models/reviewModel");

exports.addReview = (req, res) => {
  const { shop_id, user_id, rating, comment } = req.body;
  reviewModel.addReview([shop_id, user_id, rating, comment], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error adding review" });
    reviewModel.updateShopRating(shop_id, () => {
      res.json({ success: true, message: "Review added" });
    });
  });
};

exports.getReviews = (req, res) => {
  const { shop_id } = req.params;
  reviewModel.getReviewsByShop(shop_id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching reviews" });
    res.json({ success: true, data: result });
  });
};