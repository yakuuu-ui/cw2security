const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
exports.createCheckoutSession = async (req, res) => {
    const { amount, customerId, cartItems, billingDetails } = req.body;

    try {
        if (!amount || amount <= 0) {
            console.error('Invalid amount provided:', amount);
            return res.status(400).json({ message: 'Invalid amount' });
        }

        console.log('Creating checkout session with amount:', amount, 'customerId:', customerId);

        // Create line items from cart items
        const lineItems = cartItems ? cartItems.map(item => ({
            price_data: {
                currency: 'npr',
                product_data: {
                    name: item.itemId.name,
                    images: item.itemId.image ? [`http://localhost:3000/uploads/${item.itemId.image}`] : [],
                },
                unit_amount: Math.round(item.itemId.price * 100), // Convert to paisa
            },
            quantity: item.quantity,
        })) : [{
            price_data: {
                currency: 'npr',
                product_data: {
                    name: 'Order Payment',
                },
                unit_amount: Math.round(amount * 100), // Convert to paisa
            },
            quantity: 1,
        }];

        // Add delivery charge if applicable
        if (amount > 0) {
            lineItems.push({
                price_data: {
                    currency: 'npr',
                    product_data: {
                        name: 'Delivery Charge',
                    },
                    unit_amount: 500, // Rs 5.00 in paisa
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout`,
            metadata: {
                customerId: customerId || 'unknown',
                billingDetails: JSON.stringify(billingDetails || {}),
            },
        });

        console.log('Checkout session created:', session.id);
        res.status(200).json({
            sessionId: session.id,
            url: session.url,
        });
    } catch (error) {
        console.error('Stripe createCheckoutSession error:', error.message, error.stack);
        res.status(500).json({ message: `Failed to create checkout session: ${error.message}` });
    }
};

// Create Payment Intent (kept for backward compatibility)
exports.createPaymentIntent = async (req, res) => {
    const { amount, customerId } = req.body;

    try {
        if (!amount || amount <= 0) {
            console.error('Invalid amount provided:', amount);
            return res.status(400).json({ message: 'Invalid amount' });
        }

        console.log('Creating payment intent with amount:', amount, 'customerId:', customerId);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paisa for NPR
            currency: 'npr',
            metadata: { customerId: customerId || 'unknown' },
        });

        console.log('Payment intent created:', paymentIntent.id);
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe createPaymentIntent error:', error.message, error.stack);
        res.status(500).json({ message: `Failed to create payment intent: ${error.message}` });
    }
};

// Webhook handler to update order status after payment
exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log('Webhook event received:', event.type);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message, err.stack);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);

        // Here you can create the order in your database
        // The order creation logic should be implemented here
        // You can access session.metadata for customer and billing details
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent.id);
    }

    res.json({ received: true });
};