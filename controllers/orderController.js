const db = require("../config/db");

// PLACE ORDER (after payment success)
exports.placeOrder = (req, res) => {
  const {
    user_id, shop_id, service_id,
    booking_date, time_slot, payment_id,
  } = req.body;

  const sql = `
    INSERT INTO orders
    (user_id, shop_id, service_id, booking_date, time_slot, payment_id, payment_status, status)
    VALUES (?, ?, ?, ?, ?, ?, 'paid', 'booked')
  `;

  db.query(sql,
    [user_id, shop_id, service_id, booking_date, time_slot, payment_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Error placing order" });
      }
      res.json({ success: true, message: "Order placed successfully" });
    }
  );
};

// CUSTOMER → GET THEIR ORDERS
// FIXED: use user_id from URL param (not req.user.id)
// FIXED: wrap result in {success, data}
exports.getMyOrders = (req, res) => {
  const userId = req.params.user_id || req.params.userId;

  db.query(
    `SELECT o.*, s.name as shop_name, s.image as shop_image,
            sv.name as service_name
     FROM orders o
     LEFT JOIN shops s ON o.shop_id = s.id
     LEFT JOIN shop_services sv ON o.service_id = sv.id
     WHERE o.user_id = ?
     ORDER BY o.id DESC`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Error" });
      res.json({ success: true, data: result });
    }
  );
};

// PARTNER → GET SHOP ORDERS
// FIXED: wrap result in {success, data}
exports.getShopOrders = (req, res) => {
  const shopId = req.params.shop_id;

  db.query(
    `SELECT o.*, u.name as user_name, u.email as user_email,
            sv.name as service_name
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     LEFT JOIN shop_services sv ON o.service_id = sv.id
     WHERE o.shop_id = ?
     ORDER BY o.id DESC`,
    [shopId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Error" });
      res.json({ success: true, data: result });
    }
  );
};

// UPDATE STATUS
exports.updateStatus = (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, orderId],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: "Error updating" });
      res.json({ success: true, message: "Status updated" });
    }
  );
};