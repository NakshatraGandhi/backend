const express = require("express");
const router = express.Router();
const controller = require("../controllers/shopController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/", authMiddleware(["partner"]), upload.single("image"), controller.createShop);

router.get("/search", controller.searchShops);
router.get("/nearby/all", controller.getNearbyShopsAll);
router.get("/nearby/:service_id", controller.getNearbyShops);

router.get("/owner/:owner_id", controller.getShopsByOwner);
router.get("/detail/:id", controller.getShopById);
router.get("/by-service", controller.getShopsByService);
router.get("/all", controller.getAllShops);
router.get("/:service_id", controller.getShops);

module.exports = router;
