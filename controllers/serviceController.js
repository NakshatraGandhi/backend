const serviceModel = require("../models/serviceModel");

// GET ALL SERVICES
exports.getServices = (req, res) => {
  try {
    serviceModel.getServices((err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error fetching services",
        });
      }

      res.json({
        success: true,
        data: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ADD SERVICE (with image upload)
exports.addService = (req, res) => {
  try {
    const { name } = req.body;

    // Get uploaded image filename
    const image = req.file ? req.file.filename : null;

    serviceModel.addService([name, image], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error adding service",
          error: err,
        });
      }

      res.json({
        success: true,
        message: "Service Added Successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};