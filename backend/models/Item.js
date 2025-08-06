const mongoose = require("mongoose");

// Item Schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: String,
        required: true,
        min: 0,  // Ensure price cannot be negative
    },
    availability: {
        type: String,
        enum: ["In Stock", "Out of Stock"],
        required: true,
    },
    image: {
        type: String,  // Assuming image URL or file path
        required: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category", // Reference to Category model
        required: true,
    },
    subcategory: {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory", // Reference to Subcategory model
        required: true,
    },
    tags: {
        type: [String],
        enum: ["Featured", "Popular", "Trending", "Special"],
        default: [], // By default, an item won't belong to any special category
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Item", itemSchema);
