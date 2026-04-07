const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

//  CUSTOMER
router.post("/create", bookingController.createBooking);
router.get("/user/:userId", bookingController.getUserBookings);

//  SLOTS (VERY IMPORTANT FOR SLOT SCREEN)
router.get("/slots", bookingController.getAvailableSlots);

//  ADMIN / SHOP
router.get("/shop/:shopId", bookingController.getShopBookings);

//  SUPER ADMIN (ALL BOOKINGS)
router.get("/admin/all", bookingController.getAllBookings);

//  UPDATE STATUS
router.put("/:id/status", bookingController.updateBookingStatus);

module.exports = router;