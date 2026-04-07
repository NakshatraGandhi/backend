const Notification = require("../models/notificationModel");

exports.addNotification = (req, res) => {
  const data = [req.user.id, req.body.title, req.body.message];
  Notification.createNotification(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, ...req.body });
  });
};

exports.getNotifications = (req, res) => {
  Notification.getNotificationsByUser(req.params.userId, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    // FIXED: wrap in {success, data} so Flutter api_service can read data['data']
    res.json({ success: true, data: rows });
  });
};

exports.markNotificationRead = (req, res) => {
  Notification.markAsRead(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};

exports.deleteNotification = (req, res) => {
  Notification.deleteNotification(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};