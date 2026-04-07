const express = require("express");
const router = express.Router();
const controller = require("../controllers/reviewController");

router.post("/", controller.addReview);
router.get("/:shop_id", controller.getReviews);

module.exports = router;