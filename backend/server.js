const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const cors = require("cors");
const csurf = require("csurf");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config({ path: "./config/config.env" });

// Connect to database
connectDB();
require("./utils/cleanup");

const app = express();

// CORS configuration
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);

// Body parser middleware
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Security middleware
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

// Rate limiting for brute-force prevention
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
});
app.use("/api/v1/auth", limiter);

// Initialize CSRF protection
const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    },
});

// Apply CSRF protection to all routes except Stripe, cart, and order endpoints
app.use((req, res, next) => {
    if (req.path.startsWith('/api/v1/stripe/') || req.path.startsWith('/api/v1/cart/') || req.path.startsWith('/api/v1/order/')) {
        // Skip CSRF for Stripe, cart, and order endpoints
        return next();
    }
    csrfProtection(req, res, next);
});

// CSRF token endpoint
app.get("/api/v1/auth/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Route files
const auth = require("./routes/customer");
const category = require("./routes/category");
const subcategory = require("./routes/subcategory");
const item = require("./routes/item");
const wishlist = require("./routes/wishlist");
const cart = require("./routes/cart");
const order = require("./routes/order");
const stripeRoutes = require("./routes/stripe");


// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/category", category);
app.use("/api/v1/subcategory", subcategory);
app.use("/api/v1/item", item);
app.use("/api/v1/wishlist", wishlist);
app.use("/api/v1/cart", cart);
app.use("/api/v1/order", order);
app.use("/api/v1/stripe", stripeRoutes);
app.use("/api/v1/stripe/webhook", express.raw({ type: "application/json" }), stripeRoutes);


// Error handling for CSRF token validation
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({ success: false, message: "Invalid CSRF token" });
    }
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});

module.exports = app;