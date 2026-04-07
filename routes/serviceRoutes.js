const express = require("express");
const router = express.Router();
const controller = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


// PUBLIC → Get all services (for customers)
router.get("/", controller.getServices);

// PARTNER → Add new service
router.post(
  "/",
  authMiddleware(["partner"]),
  upload.single("image"),
  controller.addService
);

module.exports = router;



