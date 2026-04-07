const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const upload = require("../middleware/upload");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", controller.getProfile);
router.put("/profile", upload.single("image"), controller.updateProfile);

module.exports = router;