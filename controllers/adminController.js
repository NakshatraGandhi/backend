const db = require("../config/db");

// ── STATS ────────────────────────────────────────────────────────────────────

exports.getStats = (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const statsQuery = `
    SELECT
      (SELECT COUNT(*) FROM shops) AS totalShops,
      (SELECT COUNT(*) FROM users WHERE role = 'customer') AS totalUsers,
      (SELECT COUNT(*) FROM appointments WHERE DATE(created_at) = ?) AS bookingsToday,
      (SELECT COUNT(*) FROM orders) AS totalOrders
  `;

  db.query(statsQuery, [today], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error fetching stats", error: err });
    }
    res.json({ success: true, data: result[0] });
  });
};

// ── SHOPS ────────────────────────────────────────────────────────────────────

exports.getAllShops = (req, res) => {
  db.query("SELECT * FROM shops ORDER BY id DESC", (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error fetching shops", error: err });
    }
    res.json({ success: true, data: result });
  });
};

exports.createShop = (req, res) => {
  try {
    const {
      name, service_id, owner_id,
      latitude, longitude, address,
      phone, opening_time, closing_time
    } = req.body;

    const image = req.file ? req.file.filename : null;

    db.query(
      `INSERT INTO shops 
       (name, service_id, owner_id, image, latitude, longitude, address, phone, opening_time, closing_time)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        name,
        service_id || null,
        owner_id || null,
        image,
        latitude || null,
        longitude || null,
        address || null,
        phone || null,
        opening_time || "09:00",
        closing_time || "21:00"
      ],
      (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Error creating shop", error: err });
        }
        res.json({ success: true, message: "Shop created successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateShop = (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, service_id, address,
      phone, opening_time, closing_time
    } = req.body;

    const image = req.file ? req.file.filename : null;

    // Build dynamic update query
    const fields = [];
    const values = [];

    if (name)          { fields.push("name = ?");          values.push(name); }
    if (service_id)    { fields.push("service_id = ?");    values.push(service_id); }
    if (address)       { fields.push("address = ?");       values.push(address); }
    if (phone)         { fields.push("phone = ?");         values.push(phone); }
    if (opening_time)  { fields.push("opening_time = ?");  values.push(opening_time); }
    if (closing_time)  { fields.push("closing_time = ?");  values.push(closing_time); }
    if (image)         { fields.push("image = ?");         values.push(image); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    values.push(id);

    db.query(
      `UPDATE shops SET ${fields.join(", ")} WHERE id = ?`,
      values,
      (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Error updating shop", error: err });
        }
        res.json({ success: true, message: "Shop updated successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteShop = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM shops WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error deleting shop", error: err });
    }
    res.json({ success: true, message: "Shop deleted successfully" });
  });
};

// ── SERVICES ─────────────────────────────────────────────────────────────────

exports.getServicesByShop = (req, res) => {
  const { shop_id } = req.params;

  db.query(
    "SELECT * FROM services WHERE shop_id = ? ORDER BY id DESC",
    [shop_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error fetching services", error: err });
      }
      res.json({ success: true, data: result });
    }
  );
};

exports.createService = (req, res) => {
  try {
    const { shop_id, name, price, duration, description } = req.body;

    db.query(
      `INSERT INTO services (shop_id, name, price, duration, description)
       VALUES (?,?,?,?,?)`,
      [shop_id, name, price, duration || null, description || null],
      (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Error creating service", error: err });
        }
        res.json({ success: true, message: "Service created successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateService = (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration, description } = req.body;

    const fields = [];
    const values = [];

    if (name)        { fields.push("name = ?");        values.push(name); }
    if (price)       { fields.push("price = ?");       values.push(price); }
    if (duration)    { fields.push("duration = ?");    values.push(duration); }
    if (description) { fields.push("description = ?"); values.push(description); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    values.push(id);

    db.query(
      `UPDATE services SET ${fields.join(", ")} WHERE id = ?`,
      values,
      (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Error updating service", error: err });
        }
        res.json({ success: true, message: "Service updated successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteService = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM services WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error deleting service", error: err });
    }
    res.json({ success: true, message: "Service deleted successfully" });
  });
};

// ── USERS ────────────────────────────────────────────────────────────────────

exports.getAllUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, phone, role, is_blocked, created_at FROM users WHERE role = 'customer' ORDER BY id DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error fetching users", error: err });
      }
      res.json({ success: true, data: result });
    }
  );
};

exports.toggleUserBlock = (req, res) => {
  const { id } = req.params;
  const { is_blocked } = req.body;

  db.query(
    "UPDATE users SET is_blocked = ? WHERE id = ?",
    [is_blocked ? 1 : 0, id],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error updating user", error: err });
      }
      res.json({ success: true, message: is_blocked ? "User blocked" : "User unblocked" });
    }
  );
};

// ── BOOKINGS ─────────────────────────────────────────────────────────────────

exports.getAllBookings = (req, res) => {
  const query = `
    SELECT 
      a.id, a.status, a.date, a.time_slot, a.created_at,
      u.name AS user_name, u.email AS user_email,
      s.name AS shop_name,
      sv.name AS service_name, sv.price AS service_price
    FROM appointments a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN shops s ON a.shop_id = s.id
    LEFT JOIN services sv ON a.shop_service_id = sv.id
    ORDER BY a.created_at DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error fetching bookings", error: err });
    }
    res.json({ success: true, data: result });
  });
};

exports.updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["pending", "confirmed", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  db.query(
    "UPDATE appointments SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error updating booking", error: err });
      }
      res.json({ success: true, message: "Booking status updated" });
    }
  );
};

// ── ORDERS ───────────────────────────────────────────────────────────────────

exports.getAllOrders = (req, res) => {
  const query = `
    SELECT 
      o.id, o.status, o.total_amount, o.created_at,
      u.name AS user_name, u.email AS user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error fetching orders", error: err });
    }
    res.json({ success: true, data: result });
  });
};

exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["pending", "processing", "delivered", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error updating order", error: err });
      }
      res.json({ success: true, message: "Order status updated" });
    }
  );
};