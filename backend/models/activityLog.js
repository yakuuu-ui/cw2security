const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null,
    },
    action: {
        type: String,
        required: [true, "Action is required"],
        enum: [
            "Registration Attempt",
            "Login Attempt",
            "OTP Verification Attempt",
            "OTP Verification",
            "Update Profile Attempt",
            "Update Password Attempt",
            "Password Reset Request",
            "Password Reset Attempt",
            "Delete Customer Attempt",
            "Image Upload Attempt",
        ],
    },
    success: {
        type: Boolean,
        required: [true, "Success status is required"],
    },
    details: {
        type: String,
        required: [true, "Details are required"],
    },
    ipAddress: {
        type: String,
        required: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);