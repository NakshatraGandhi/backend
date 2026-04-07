const express = require("express");
const {
  addTicket,
  getTickets,
  updateTicket,
  deleteTicket,
} = require("../controllers/supportController");

// ✅ FIX: remove destructuring
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Use roles properly
router.post("/", protect(["user"]), addTicket);
router.get("/:userId", protect(["user"]), getTickets);
router.put("/:id", protect(["user"]), updateTicket);
router.delete("/:id", protect(["user"]), deleteTicket);

module.exports = router;