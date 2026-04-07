const express = require("express");
const router = express.Router();
const controller = require("../controllers/shopServiceController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware(["partner"]), controller.addShopService);
router.get("/:shop_id", controller.getShopServices);
router.delete("/:id", authMiddleware(["partner"]), controller.deleteShopService);

module.exports = router;