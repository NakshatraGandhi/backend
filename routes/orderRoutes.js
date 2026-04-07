const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// Place order (after payment)
router.post("/", authMiddleware(["customer"]), controller.placeOrder);

// FIXED: was /my-orders — changed to /user/:user_id to match api_service.dart
router.get("/user/:user_id", controller.getMyOrders);

// Partner — get shop orders
router.get("/shop/:shop_id", authMiddleware(["partner"]), controller.getShopOrders);

// Update order status
router.put("/:id/status", authMiddleware(["partner"]), controller.updateStatus);

module.exports = router;