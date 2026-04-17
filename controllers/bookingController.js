const db = require("../config/db");
//  CREATE BOOKING (with slot check)
exports.createBooking = (req, res) => {
  console.log("Incoming booking:", req.body);
  const {
    userId,
    shopId,
    serviceId,
    serviceName,
    date,
    timeSlot,
    measurements,
    extraData,
  } = req.body;

  //  CHECK IF SLOT ALREADY BOOKED
  const checkSql = `
    SELECT * FROM bookings 
    WHERE shop_id=? AND date=? AND time_slot=?
  `;

  db.query(checkSql, [shopId, date, timeSlot], (err, existing) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false });
    }

    if (existing.length > 0) {
      return res.json({
        success: false,
        message: "Slot already booked",
      });
    }

    //  INSERT BOOKING
    const insertSql = `
      INSERT INTO bookings 
      (user_id, shop_id, service_id, service_name, date, time_slot, measurements, extra_data, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    db.query(
      insertSql,
      [
        userId,
        shopId,
        serviceId,
        serviceName,
        date,
        timeSlot,
        JSON.stringify(measurements || {}),
        JSON.stringify(extraData || {}),
      ],
      (err, result) => {
        if (err) {
          console.log("Create Booking Error:", err);
          return res.status(500).json({ success: false });
        }

        res.json({
          success: true,
          message: "Booking request sent",
          bookingId: result.insertId,
        });
      }
    );
  });
};



//  GET AVAILABLE SLOTS (VERY IMPORTANT FOR YOUR SLOT SCREEN)
exports.getAvailableSlots = (req, res) => {
  const { shopId, date } = req.query;

  //  STATIC SLOT LIST (you can change later)
  const allSlots = [
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  db.query(
    "SELECT time_slot FROM bookings WHERE shop_id=? AND date=?",
    [shopId, date],
    (err, booked) => {
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }

      const bookedSlots = booked.map((b) => b.time_slot);

      const result = allSlots.map((slot) => ({
        slot,
        available: !bookedSlots.includes(slot),
      }));

      res.json(result);
    }
  );
};



//  GET USER BOOKINGS
// REPLACE THE ENTIRE getUserBookings function:
exports.getUserBookings = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      b.*,
      s.name AS shop_name,
      s.image AS shop_image,
      s.address AS shop_address,
      sv.name AS service_name,
      sv.price AS service_price
    FROM bookings b
    LEFT JOIN shops s ON b.shop_id = s.id
    LEFT JOIN services sv ON b.service_id = sv.id
    WHERE b.user_id = ?
    ORDER BY b.id DESC
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
};

//  GET SHOP BOOKINGS (Admin / Tailor)
exports.getShopBookings = (req, res) => {
  const { shopId } = req.params;

  db.query(
    "SELECT * FROM bookings WHERE shop_id=? ORDER BY id DESC",
    [shopId],
    (err, result) => {
      if (err) return res.status(500).json([]);
      res.json(result);
    }
  );
};



//  GET ALL BOOKINGS (SUPER ADMIN)
exports.getAllBookings = (req, res) => {
  const query = `
    SELECT 
      b.*,
      u.name AS user_name,
      u.email AS user_email,
      s.name AS shop_name,
      sv.name AS service_name,
      sv.price AS service_price
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN shops s ON b.shop_id = s.id
    LEFT JOIN services sv ON b.service_id = sv.id
    ORDER BY b.id DESC
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json([]);
    res.json(result);
  });
};



// REPLACE THE ENTIRE updateBookingStatus function:
exports.updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // First get booking details to find user_id
  db.query("SELECT * FROM bookings WHERE id = ?", [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(500).json({ success: false });
    }

    const booking = rows[0];

    db.query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, id],
      (err2) => {
        if (err2) {
          return res.status(500).json({ success: false });
        }

        //  Send notification to customer
        const messages = {
          confirmed:  "Your booking has been confirmed by the shop! 🎉",
          completed:  "Your service has been completed. Thank you! ⭐",
          cancelled:  "Your booking has been cancelled. Please contact the shop.",
          pending:    "Your booking is pending approval.",
        };

        const msg = messages[status.toLowerCase()] || `Your booking status is now: ${status}`;
        const title = status.charAt(0).toUpperCase() + status.slice(1);

        db.query(
          "INSERT INTO notifications (user_id, title, message, read_status) VALUES (?, ?, ?, 0)",
          [booking.user_id, `Booking ${title}`, msg],
          () => {} // fire and forget
        );

        res.json({ success: true, message: "Status updated" });
      }
    );
  });
};