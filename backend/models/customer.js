const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const customerSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lname: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [/^\+?\d{10,15}$/, "Phone number must be 10-15 digits"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            trim: true,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        image: {
            type: String,
            default: null,
            trim: true,
        },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: null,
            select: false,
        },
        otpExpire: {
            type: Date,
            default: null,
            select: false,
        },
        termsAccepted: {
            type: Boolean,
            required: [true, "You must accept the Terms and Conditions"],
            default: false,
        },
        resetPasswordToken: {
            type: String,
            default: null,
            select: false,
        },
        resetPasswordExpire: {
            type: Date,
            default: null,
            select: false,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Pre-save password hashing
customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error('Password Hashing Error:', error.message);
        next(error);
    }
});

// Generate JWT
customerSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Match passwords
customerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate 6-digit OTP
customerSchema.methods.getOtp = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = crypto.createHash("sha256").update(otp).digest("hex");
    this.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    console.log('Generated OTP:', {
        otp: otp, // Log plaintext OTP for debugging (remove in production)
        hashedOtp: this.otp,
        otpExpire: new Date(this.otpExpire).toISOString(),
        userId: this._id
    });
    return otp;
};

// Match OTP
customerSchema.methods.matchOtp = async function (enteredOtp) {
    const hashedEnteredOtp = crypto.createHash("sha256").update(enteredOtp).digest("hex");
    console.log('OTP Comparison:', {
        enteredOtp,
        hashedEnteredOtp,
        storedOtp: this.otp,
        isMatch: this.otp === hashedEnteredOtp
    });
    return this.otp === hashedEnteredOtp;
};

customerSchema.methods.matchOtp = async function (enteredOtp) {
    const hashedOtp = crypto.createHash("sha256").update(enteredOtp).digest("hex");
    return hashedOtp === this.otp;
  };

module.exports = mongoose.models.Customer || mongoose.model("Customer", customerSchema);