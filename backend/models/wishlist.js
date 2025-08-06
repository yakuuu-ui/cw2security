const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Customer" }, // Reference Customer instead of User
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item" },
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
