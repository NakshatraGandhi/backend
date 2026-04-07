const express = require("express");
const router = express.Router();
const controller = require("../controllers/favouriteController");

router.post("/", controller.addFavourite);
router.delete("/:user_id/:shop_id", controller.removeFavourite);
router.get("/:user_id", controller.getFavourites);
router.get("/check/:user_id/:shop_id", controller.isFavourite);

module.exports = router;