const Cart = require("../models/Cart");

// Get Cart by Customer ID
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerId: req.params.customerId }).populate("items.itemId");
        res.json(cart || { customerId: req.params.customerId, items: [] });
    } catch (error) {
        res.status(500).json({ error: "Error fetching cart" });
    }
};

// Add Item to Cart
exports.addToCart = async (req, res) => {
    const { customerId, itemId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ customerId });

        if (!cart) {
            cart = new Cart({ customerId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.itemId.toString() === itemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ itemId, quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error adding item to cart" });
    }
};

// Update Item Quantity in Cart
exports.updateCartItem = async (req, res) => {
    const { customerId, itemId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ customerId });

        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const item = cart.items.find((item) => item.itemId.toString() === itemId);

        if (!item) return res.status(404).json({ error: "Item not found in cart" });

        item.quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error updating cart item" });
    }
};

// Remove Item from Cart
// Controller for removing an item from the cart
exports.removeCartItem = async (req, res) => {
    try {
        const { customerId } = req.query;  // Get customerId from query params
        const { itemId } = req.params;  // Get itemId from route params

        // Find the cart for the customer
        const cart = await Cart.findOne({ customerId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Filter out the item from the cart's items array
        const updatedItems = cart.items.filter(item => item.itemId._id.toString() !== itemId);

        // Update the cart with the new items list
        cart.items = updatedItems;
        await cart.save();

        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};





// Clear Cart
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ customerId: req.params.customerId });
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: "Error clearing cart" });
    }
};
