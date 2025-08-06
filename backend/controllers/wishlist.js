const Wishlist = require("../models/wishlist");

// ✅ Add item to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { customerId, itemId } = req.body;

        // Check if item is already in wishlist
        const existingItem = await Wishlist.findOne({ customerId, itemId });

        if (existingItem) {
            return res.status(400).json({ message: "Item already in wishlist" });
        }

        const wishlistItem = new Wishlist({ customerId, itemId });
        await wishlistItem.save();

        res.status(200).json({ message: "Added to wishlist", wishlistItem });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ❌ Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { customerId } = req.query;
        const { itemId } = req.params;

        await Wishlist.findOneAndDelete({ customerId, itemId });

        res.status(200).json({ message: "Removed from wishlist", Wishlist });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// exports.removeFromWishlist = async (req, res) => {
//     try {
//         const { customerId } = req.query;  // Get customerId from query params
//         const { itemId } = req.params;     // Get itemId from route params

//         // Remove the wishlist entry that matches both customerId and itemId
//         const result = await Wishlist.findOneAndDelete({ customerId, itemId });

//         if (!result) {
//             return res.status(404).json({ message: "Item not found in wishlist" });
//         }

//         res.status(200).json({ message: "Item removed from wishlist" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };


// ✅ Check if item is in wishlist
exports.checkWishlistStatus = async (req, res) => {
    try {
        const { customerId } = req.query;
        const { itemId } = req.params;

        const exists = await Wishlist.findOne({ customerId, itemId });

        res.status(200).json({ isWishlisted: !!exists });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Get all wishlist items for a customer
exports.getCustomerWishlist = async (req, res) => {
    try {
        const { customerId } = req.params;
        const wishlistItems = await Wishlist.find({ customerId }).populate("itemId");

        res.status(200).json({ wishlist: wishlistItems });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
