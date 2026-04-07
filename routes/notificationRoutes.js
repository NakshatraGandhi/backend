const express = require("express");
const {
  addNotification,
  getNotifications,
  markNotificationRead,
  deleteNotification,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect(["customer"]), addNotification);

router.get("/user/:userId", getNotifications);

router.put("/:id/read", protect(["customer"]), markNotificationRead);
router.delete("/:id", protect(["customer"]), deleteNotification);

module.exports = router;