const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            },
        },
    ],
});

module.exports = mongoose.model("Cart", CartSchema);
