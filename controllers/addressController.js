const Address = require("../models/addressModel");

exports.addAddress = (req, res) => {
  // FIXED: get user_id from body (sent by Flutter) OR from req.user if auth present
  const userId = req.body.user_id || (req.user && req.user.id);

  const data = [
    userId,
    req.body.label,
    req.body.addressLine,
    req.body.city,
    req.body.state,
    req.body.pincode,
    req.body.latitude || null,
    req.body.longitude || null,
  ];

  Address.createAddress(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, id: result.insertId, ...req.body });
  });
};

exports.getAddresses = (req, res) => {
  Address.getAddressesByUser(req.params.userId, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

exports.deleteAddress = (req, res) => {
  Address.deleteAddress(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};