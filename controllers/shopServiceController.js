const shopServiceModel = require("../models/shopServiceModel");

exports.addShopService = (req, res) => {
  const { shop_id, name, price, duration_mins, category } = req.body;
  shopServiceModel.addShopService(
    [shop_id, name, price, duration_mins, category],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error adding service",
          error: err,
        });
      }
      res.json({
        success: true,
        message: "Service added successfully",
      });
    }
  );
};

exports.getShopServices = (req, res) => {
  const { shop_id } = req.params;
  shopServiceModel.getShopServices(shop_id, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching services",
        error: err,
      });
    }
    res.json({
      success: true,
      data: result,
    });
  });
};

exports.deleteShopService = (req, res) => {
  const { id } = req.params;
  shopServiceModel.deleteShopService(id, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error deleting service",
        error: err,
      });
    }
    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  });
};