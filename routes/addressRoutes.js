const express = require("express");
const {
  addAddress,
  getAddresses,
  deleteAddress,
} = require("../controllers/addressController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", protect(["customer"]), addAddress);
router.get("/:userId", getAddresses);
router.delete("/:id", protect(["customer"]), deleteAddress);

module.exports = router;