const Order = require("../models/Order"); // Assuming the model is in the "models" folder

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        console.log('Creating order with data:', req.body);

        const { userId, cartItems, billingDetails, paymentMethod, paymentStatus, subtotal, deliveryCharge, totalPrice, stripeSessionId } = req.body;

        const newOrder = new Order({
            userId,
            cartItems,
            billingDetails,
            paymentMethod,
            paymentStatus: paymentStatus || 'paid',
            subtotal,
            deliveryCharge,
            totalPrice,
            orderStatus: 'pending', // Default order status
        });

        console.log('New order object:', newOrder);

        // Save the order to the database
        const order = await newOrder.save();
        console.log('Order saved successfully:', order._id);
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching order" });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId }).populate('cartItems.itemId');

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this customer" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};
exports.getTotalRevenue = async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            { $match: { orderStatus: "Completed" } }, // Only count completed orders
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);

        const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

        res.status(200).json({ totalRevenue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error calculating revenue" });
    }
};

exports.getOrdersRevenue = async (req, res) => {
    try {
        const ordersRevenue = await Order.aggregate([
            { $match: { orderStatus: "Completed" } }, // Filter completed orders
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.status(200).json(ordersRevenue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders revenue" });
    }
};

exports.getPopularCategories = async (req, res) => {
    try {
        const popularCategories = await Order.aggregate([
            { $unwind: "$cartItems" }, // Flatten the cartItems array
            {
                $group: {
                    _id: "$cartItems.category", // Group by category
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { totalOrders: -1 } }, // Sort in descending order
            { $limit: 5 } // Limit to top 5 popular categories
        ]);

        res.status(200).json(popularCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching popular categories" });
    }
};

// Get top-selling foods based on total quantity sold
exports.getTopSellingFoods = async (req, res) => {
    try {
        const topSellingFoods = await Order.aggregate([
            { $unwind: "$cartItems" }, // Flatten the cartItems array
            {
                $group: {
                    _id: "$cartItems.itemId", // Group by itemId
                    totalQuantity: { $sum: "$cartItems.quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } }, // Sort in descending order
            { $limit: 5 } // Limit to top 5 best-selling foods
        ]);

        res.status(200).json(topSellingFoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching top-selling foods" });
    }
};

// Get most popular foods based on number of orders
exports.getPopularFoods = async (req, res) => {
    try {
        const popularFoods = await Order.aggregate([
            { $unwind: "$cartItems" }, // Flatten the cartItems array
            {
                $group: {
                    _id: "$cartItems.itemId", // Group by itemId
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { totalOrders: -1 } }, // Sort in descending order
            { $limit: 5 } // Limit to top 5 most ordered foods
        ]);

        res.status(200).json(popularFoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching popular foods" });
    }
};

