const express = require("express");
const router = express.Router();
const cart = require("../controllers/cart");

router.get("/:customerId", cart.getCart);
router.post("/add", cart.addToCart);
router.put("/update", cart.updateCartItem);
router.delete("/remove/:itemId", cart.removeCartItem);
router.delete("/clear/:customerId", cart.clearCart);

module.exports = router;
