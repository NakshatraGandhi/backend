const db = require("../config/db");

exports.createNotification = (data, callback) => {
  db.query(
    "INSERT INTO notifications (user_id, title, message) VALUES (?,?,?)",
    data,
    callback
  );
};

exports.getNotificationsByUser = (userId, callback) => {
  db.query("SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC", [userId], callback);
};

exports.markAsRead = (id, callback) => {
  db.query("UPDATE notifications SET read_status=1 WHERE id=?", [id], callback);
};

exports.deleteNotification = (id, callback) => {
  db.query("DELETE FROM notifications WHERE id=?", [id], callback);
};
