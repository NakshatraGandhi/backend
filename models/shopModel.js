const db = require("../config/db");

// CREATE SHOP
exports.createShop = (data, callback) => {
  db.query(
    `INSERT INTO shops 
     (name, service_id, owner_id, image, latitude, longitude, address, phone, opening_time, closing_time) 
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    data,
    callback
  );
};


// GET SHOPS BY SERVICE (with fallback)
exports.getShopsByService = (service_id, lat, lng, callback) => {

  // ✅ If location is available → calculate distance
  if (lat && lng) {
    const query = `
      SELECT *,
        (6371 * ACOS(
          COS(RADIANS(?)) * COS(RADIANS(latitude)) *
          COS(RADIANS(longitude) - RADIANS(?)) +
          SIN(RADIANS(?)) * SIN(RADIANS(latitude))
        )) AS distance
      FROM shops
      WHERE service_id=?
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
      ORDER BY distance ASC
    `;

    db.query(query, [lat, lng, lat, service_id], callback);

  } else {

    // 🔹 Fallback → your original query
    db.query(
      "SELECT * FROM shops WHERE service_id=?",
      [service_id],
      callback
    );
  }
};


// GET SHOP BY ID
exports.getShopById = (id, callback) => {
  db.query("SELECT * FROM shops WHERE id=?", [id], callback);
};


// NEARBY SHOPS (already perfect)
exports.getNearbyShops = (service_id, lat, lng, radiusKm, callback) => {
  const query = `
    SELECT *,
      (6371 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(latitude)) *
        COS(RADIANS(longitude) - RADIANS(?)) +
        SIN(RADIANS(?)) * SIN(RADIANS(latitude))
      )) AS distance
    FROM shops
    WHERE service_id = ?
      AND latitude IS NOT NULL
      AND longitude IS NOT NULL
    HAVING distance <= ?
    ORDER BY distance ASC
  `;

  db.query(query, [lat, lng, lat, service_id, radiusKm], callback);
};


// SEARCH SHOPS
exports.searchShops = (keyword, lat, lng, callback) => {
  const query = `
    SELECT s.*,
      (6371 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(s.latitude)) *
        COS(RADIANS(s.longitude) - RADIANS(?)) +
        SIN(RADIANS(?)) * SIN(RADIANS(s.latitude))
      )) AS distance
    FROM shops s
    WHERE s.name LIKE ?
      AND s.latitude IS NOT NULL
    ORDER BY distance ASC
    LIMIT 20
  `;

  db.query(query, [lat, lng, lat, `%${keyword}%`], callback);
};


// GET SHOPS BY OWNER
exports.getShopsByOwner = (owner_id, callback) => {
  db.query(
    "SELECT * FROM shops WHERE owner_id=?",
    [owner_id],
    callback
  );
};


// GET ALL SHOPS (with fallback)
exports.getAllShops = (lat, lng, callback) => {

  // ✅ If location available → calculate distance
  if (lat && lng) {
    const query = `
      SELECT *,
        (6371 * ACOS(
          COS(RADIANS(?)) * COS(RADIANS(latitude)) *
          COS(RADIANS(longitude) - RADIANS(?)) +
          SIN(RADIANS(?)) * SIN(RADIANS(latitude))
        )) AS distance
      FROM shops
      WHERE latitude IS NOT NULL
        AND longitude IS NOT NULL
      ORDER BY distance ASC
    `;

    db.query(query, [lat, lng, lat], callback);

  } else {

    // 🔹 Fallback → your original query
    db.query("SELECT * FROM shops ORDER BY id DESC", callback);
  }
};