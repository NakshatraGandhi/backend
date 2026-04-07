const Support = require("../models/supportModel");

exports.addTicket = (req, res) => {
  const data = [req.user.id, req.body.subject, req.body.message];
  Support.createTicket(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, ...req.body, status: "open" });
  });
};

exports.getTickets = (req, res) => {
  Support.getTicketsByUser(req.params.userId, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

exports.updateTicket = (req, res) => {
  Support.updateTicketStatus(req.params.id, req.body.status, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};

exports.deleteTicket = (req, res) => {
  Support.deleteTicket(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};
