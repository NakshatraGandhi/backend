const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

// Slot availability — public
router.get("/slots", controller.getAvailableSlots);

// Book appointment — customer
router.post("/", authMiddleware(["customer"]), controller.createAppointment);

// Customer's own appointments
router.get("/user/:user_id", controller.getUserAppointments);

// Shop's appointments
router.get("/shop/:shop_id", controller.getShopAppointments);

// All appointments — admin
router.get("/all", authMiddleware(["admin"]), controller.getAllAppointments);

// Update status — admin
router.patch("/:id/status", authMiddleware(["admin"]), controller.updateStatus);

module.exports = router;