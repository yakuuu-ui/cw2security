const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order'); // Adjust the path to your controller

// Order Routes
router.post("/orders", orderController.createOrder);
router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.get("/orders/user/:userId", orderController.getOrdersByUserId);
router.get("/revenue", orderController.getTotalRevenue);
router.get("/orders-revenue", orderController.getOrdersRevenue);
router.get("/popular-categories", orderController.getPopularCategories);
router.get("/top-selling-foods", orderController.getTopSellingFoods);
router.get("/popular-foods", orderController.getPopularFoods);

module.exports = router;



