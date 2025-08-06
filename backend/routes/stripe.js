const express = require('express');
const router = express.Router();
const { createPaymentIntent, createCheckoutSession, handleWebhook } = require('../controllers/stripeController');

// Route to create checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Route to create payment intent
router.post('/create-payment-intent', createPaymentIntent);

router.post('/webhook', handleWebhook);

module.exports = router;
