const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const adminController = require("../controllers/adminController");

// All admin routes require role = 'admin'
const adminOnly = protect(["admin"]);

// ── Stats ────────────────────────────────────────────────────────────────────
router.get("/stats", adminOnly, adminController.getStats);

// ── Shops ────────────────────────────────────────────────────────────────────
router.get("/shops", adminOnly, adminController.getAllShops);
router.post("/shops", adminOnly, upload.single("image"), adminController.createShop);
router.put("/shops/:id", adminOnly, upload.single("image"), adminController.updateShop);
router.delete("/shops/:id", adminOnly, adminController.deleteShop);

// ── Services ─────────────────────────────────────────────────────────────────
router.get("/services/:shop_id", adminOnly, adminController.getServicesByShop);
router.post("/services", adminOnly, adminController.createService);
router.put("/services/:id", adminOnly, adminController.updateService);
router.delete("/services/:id", adminOnly, adminController.deleteService);

// ── Users ────────────────────────────────────────────────────────────────────
router.get("/users", adminOnly, adminController.getAllUsers);
router.put("/users/:id/block", adminOnly, adminController.toggleUserBlock);

// ── Bookings ─────────────────────────────────────────────────────────────────
router.get("/bookings", adminOnly, adminController.getAllBookings);
router.put("/bookings/:id/status", adminOnly, adminController.updateBookingStatus);

// ── Orders ───────────────────────────────────────────────────────────────────
router.get("/orders", adminOnly, adminController.getAllOrders);
router.put("/orders/:id/status", adminOnly, adminController.updateOrderStatus);

module.exports = router;