// utils/cleanup.js
const cron = require('node-cron');
const Customer = require('../models/customer');

// Run every day at midnight (0:00)
cron.schedule('0 0 * * *', async () => {
    try {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        const result = await Customer.deleteMany({ isVerified: false, createdAt: { $lt: cutoff } });

        if (result.deletedCount > 0) {
            console.log(`Cleanup complete — removed ${result.deletedCount} stale customers`);
        } else {
            console.log('Cleanup complete — no stale customers found.');
        }
    } catch (error) {
        console.error('Error during cleanup:', error.message);
    }
});
