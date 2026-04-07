const favouriteModel = require("../models/favouriteModel");

exports.addFavourite = (req, res) => {
  const { user_id, shop_id } = req.body;
  favouriteModel.addFavourite([user_id, shop_id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error" });
    res.json({ success: true, message: "Added to favourites" });
  });
};

exports.removeFavourite = (req, res) => {
  const { user_id, shop_id } = req.params;
  favouriteModel.removeFavourite(user_id, shop_id, (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error" });
    res.json({ success: true, message: "Removed from favourites" });
  });
};

exports.getFavourites = (req, res) => {
  const { user_id } = req.params;
  favouriteModel.getFavourites(user_id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error" });
    res.json({ success: true, data: result });
  });
};

exports.isFavourite = (req, res) => {
  const { user_id, shop_id } = req.params;
  favouriteModel.isFavourite(user_id, shop_id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error" });
    res.json({ success: true, isFavourite: result.length > 0 });
  });
};