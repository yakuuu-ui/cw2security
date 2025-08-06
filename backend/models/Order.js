const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cartItems: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item", 
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    billingDetails: {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'khalti', 'stripe'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'], 
        default: 'pending'
    },
    subtotal: {
        type: Number,
        required: true
    },
    deliveryCharge: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'completed', 'cancel'],
        default: 'pending' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
