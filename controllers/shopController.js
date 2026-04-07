const shopModel = require("../models/shopModel");
const db = require("../config/db");

exports.createShop = (req, res) => {
  try {
    const {
      name, service_id, owner_id, latitude, longitude,
      address, phone, opening_time, closing_time,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    shopModel.createShop(
      [name, service_id, owner_id, image,
       latitude || null, longitude || null,
       address || null, phone || null,
       opening_time || "09:00", closing_time || "21:00"],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: "Error creating shop", error: err });
        res.json({ success: true, message: "Shop Created Successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getShops = (req, res) => {
  try {
    const { service_id } = req.params;
    if (!service_id || service_id === "all") {
      shopModel.getAllShops((err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Error fetching shops" });
        res.json({ success: true, data: result });
      });
    } else {
      shopModel.getShopsByService(service_id, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Error fetching shops" });
        res.json({ success: true, data: result });
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllShops = (req, res) => {
  shopModel.getAllShops((err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching shops" });
    res.json({ success: true, data: result });
  });
};

exports.getShopById = (req, res) => {
  const { id } = req.params;
  shopModel.getShopById(id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error" });
    res.json({ success: true, data: result[0] });
  });
};

exports.getNearbyShops = (req, res) => {
  try {
    const { service_id } = req.params;
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return res.status(400).json({ success: false, message: "Location required" });
    const radiusKm = parseFloat(radius) || 10;
    shopModel.getNearbyShops(service_id, parseFloat(lat), parseFloat(lng), radiusKm, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Error fetching nearby shops" });
      res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getNearbyShopsAll = (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return res.status(400).json({ success: false, message: "Location required" });
    const radiusKm = parseFloat(radius) || 10;

    const query = `
      SELECT *,
        (6371 * ACOS(
          COS(RADIANS(?)) * COS(RADIANS(latitude)) *
          COS(RADIANS(longitude) - RADIANS(?)) +
          SIN(RADIANS(?)) * SIN(RADIANS(latitude))
        )) AS distance
      FROM shops
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance <= ?
      ORDER BY distance ASC
    `;

    db.query(query, [lat, lng, lat, radiusKm], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Error fetching nearby shops" });
      res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.searchShops = (req, res) => {
  const { keyword, lat, lng } = req.query;
  shopModel.searchShops(keyword || "", parseFloat(lat) || 0, parseFloat(lng) || 0, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error" });
    res.json({ success: true, data: result });
  });
};

exports.getShopsByOwner = (req, res) => {
  const { owner_id } = req.params;
  shopModel.getShopsByOwner(owner_id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error" });
    res.json({ success: true, data: result });
  });
};

// GET /api/shops/by-service?service=AC Repair
// Joins shops → services on shops.service_id and filters by service name
exports.getShopsByService = (req, res) => {
  const { service } = req.query;

  if (!service || service.trim() === "") {
    return res.status(400).json({ success: false, message: "service query param required" });
  }

  const keyword = `%${service.trim()}%`;

  const query = `
    SELECT
      s.id, s.name, s.address, s.phone, s.image,
      s.latitude, s.longitude, s.opening_time,
      s.closing_time, s.rating,
      srv.name AS service_name
    FROM shops s
    JOIN services srv ON s.service_id = srv.id
    WHERE srv.name LIKE ?
    ORDER BY s.name ASC
  `;

  db.query(query, [keyword], (err, result) => {
    if (err) {
      console.error("getShopsByService error:", err);
      return res.status(500).json({ success: false, message: "Search failed" });
    }
    res.json({ success: true, data: result });
  });
};