const db = require("../config/db");

exports.createAppointment = (data, callback) => {
  db.query(
    `INSERT INTO appointments 
     (user_id, shop_id, shop_service_id, date, time_slot, status) 
     VALUES (?,?,?,?,?,?)`,
    data,
    callback
  );
};

exports.getAppointmentsByUser = (user_id, callback) => {
  db.query(
    `SELECT a.*, s.name as shop_name, s.image as shop_image,
            ss.name as service_name, ss.price as service_price
     FROM appointments a
     JOIN shops s ON a.shop_id = s.id
     LEFT JOIN shop_services ss ON a.shop_service_id = ss.id
     WHERE a.user_id=?
     ORDER BY a.created_at DESC`,
    [user_id],
    callback
  );
};

exports.getAppointmentsByShop = (shop_id, callback) => {
  db.query(
    `SELECT a.*, u.name as user_name, u.email as user_email,
            ss.name as service_name, ss.price as service_price
     FROM appointments a
     JOIN users u ON a.user_id = u.id
     LEFT JOIN shop_services ss ON a.shop_service_id = ss.id
     WHERE a.shop_id=?
     ORDER BY a.date DESC, a.time_slot ASC`,
    [shop_id],
    callback
  );
};

exports.updateAppointmentStatus = (data, callback) => {
  db.query(
    "UPDATE appointments SET status=? WHERE id=?",
    data,
    callback
  );
};