const appointmentModel = require("../models/appointmentModel");
const db = require("../config/db");

const ALL_SLOTS = [
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

// GET /api/appointments/slots?shop_id=1&date=2024-03-01
exports.getAvailableSlots = (req, res) => {
  const { shop_id, date } = req.query;
  if (!shop_id || !date) {
    return res.status(400).json({ success: false, message: "shop_id and date required" });
  }

  appointmentModel.getBookedSlots(shop_id, date, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching slots" });

    const booked = result.map((r) => r.time_slot);
    const slots = ALL_SLOTS.map((slot) => ({
      slot,
      available: !booked.includes(slot),
    }));

    res.json({ success: true, data: slots });
  });
};

// POST /api/appointments
exports.createAppointment = (req, res) => {
  const {
    user_id, shop_id, shop_service_id,
    date, time_slot, measurements, notes, payment_id,
  } = req.body;

  const measurementsJson = measurements ? JSON.stringify(measurements) : null;

  appointmentModel.createAppointment(
    [user_id, shop_id, shop_service_id, date, time_slot,
     measurementsJson, notes || null, payment_id || null, "Pending"],
    (err, result) => {
      if (err) {
        console.error("createAppointment error:", err);
        return res.status(500).json({ success: false, message: "Error creating appointment" });
      }

      // Send notification to customer
      const notifMsg = `Your booking for ${date} at ${time_slot} is confirmed. Status: Pending.`;
      db.query(
        "INSERT INTO notifications (user_id, title, message, read_status) VALUES (?,?,?,0)",
        [user_id, "Booking Confirmed", notifMsg],
        () => {} // fire and forget
      );

      res.json({ success: true, message: "Appointment booked!" });
    }
  );
};

// GET /api/appointments/user/:user_id
exports.getUserAppointments = (req, res) => {
  const { user_id } = req.params;
  appointmentModel.getAppointmentsByUser(user_id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching appointments" });
    const data = result.map((row) => ({
      ...row,
      measurements: row.measurements ? JSON.parse(row.measurements) : null,
    }));
    res.json({ success: true, data });
  });
};

// GET /api/appointments/shop/:shop_id
exports.getShopAppointments = (req, res) => {
  const { shop_id } = req.params;
  appointmentModel.getAppointmentsByShop(shop_id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching appointments" });
    const data = result.map((row) => ({
      ...row,
      measurements: row.measurements ? JSON.parse(row.measurements) : null,
    }));
    res.json({ success: true, data });
  });
};

// GET /api/appointments/all  (admin)
exports.getAllAppointments = (req, res) => {
  const query = `
    SELECT a.*, 
      u.name as user_name, u.email as user_email,
      s.name as shop_name,
      ss.name as service_name, ss.price as service_price
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    JOIN shops s ON a.shop_id = s.id
    LEFT JOIN shop_services ss ON a.shop_service_id = ss.id
    ORDER BY a.created_at DESC
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error" });
    const data = result.map((row) => ({
      ...row,
      measurements: row.measurements ? JSON.parse(row.measurements) : null,
    }));
    res.json({ success: true, data });
  });
};

// PATCH /api/appointments/:id/status  (admin updates status)
exports.updateStatus = (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const allowed = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  // Get appointment to find user_id for notification
  db.query("SELECT * FROM appointments WHERE id = ?", [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const appt = rows[0];

    appointmentModel.updateAppointmentStatus([status, id], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: "Error updating" });

      // Notify customer about status change
      const messages = {
        'Confirmed':   'Your booking has been confirmed by the shop.',
        'In Progress': 'Your service is now in progress.',
        'Completed':   'Your service has been completed. Thank you!',
        'Cancelled':   'Your booking has been cancelled. Please contact the shop.',
      };

      const msg = messages[status] || `Your booking status is now: ${status}`;
      db.query(
        "INSERT INTO notifications (user_id, title, message, read_status) VALUES (?,?,?,0)",
        [appt.user_id, `Booking ${status}`, msg],
        () => {}
      );

      res.json({ success: true, message: "Status updated" });
    });
  });
};