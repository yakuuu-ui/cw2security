const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist");

router.post("/add", wishlistController.addToWishlist);
router.delete("/remove/:itemId", wishlistController.removeFromWishlist);
router.get("/check/:itemId", wishlistController.checkWishlistStatus);
router.get("/customer/:customerId", wishlistController.getCustomerWishlist);

module.exports = router;
