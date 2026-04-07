const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const JWT_SECRET = "bookzen_secret_2024";

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    userModel.createUser([name, email, hash, role], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Registration failed" });
      }
      res.json({ success: true, message: "Registered successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.login = (req, res) => {
  const { email, password } = req.body;
  userModel.findUserByEmail(email, async (err, result) => {
    if (err || result.length === 0)
      return res.status(401).json({ success: false, message: "User not found" });

    const valid = await bcrypt.compare(password, result[0].password);
    if (!valid)
      return res.status(401).json({ success: false, message: "Wrong password" });

    const user = result[0];
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.user?.id || req.query.user_id;
  userModel.findUserById(userId, (err, result) => {
    if (err || result.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });
    const user = result[0];
    delete user.password;
    res.json({ success: true, user });
  });
};

exports.updateProfile = async (req, res) => {
  const { name, phone, user_id } = req.body;
  const image = req.file ? req.file.filename : null;
  userModel.updateUser([name, phone, image, user_id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Update failed" });
    res.json({ success: true, message: "Profile updated" });
  });
};