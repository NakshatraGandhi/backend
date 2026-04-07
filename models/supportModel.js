const db = require("../config/db");

exports.createTicket = (data, callback) => {
  db.query(
    "INSERT INTO support_tickets (user_id, subject, message) VALUES (?,?,?)",
    data,
    callback
  );
};

exports.getTicketsByUser = (userId, callback) => {
  db.query("SELECT * FROM support_tickets WHERE user_id=?", [userId], callback);
};

exports.updateTicketStatus = (id, status, callback) => {
  db.query("UPDATE support_tickets SET status=? WHERE id=?", [status, id], callback);
};

exports.deleteTicket = (id, callback) => {
  db.query("DELETE FROM support_tickets WHERE id=?", [id], callback);
};
