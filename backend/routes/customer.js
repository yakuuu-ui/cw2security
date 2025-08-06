const express = require('express');
const router = express.Router();
const {
    validateRegister,
    validateLogin,
    validateOtp,
    register,
    login,
    getMe,
    verifyOtp,
    getCustomers,
    getCustomer,
    updateCustomer,
    updatePassword,
    forgotPassword,
    resetPassword,
    deleteCustomer,
    uploadImage,
} = require('../controllers/customer');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/uploads');

// Registration flow
router.post('/register', validateRegister, upload.single('profilePicture'), register);
router.post('/login', validateLogin, login);
router.post('/verify-otp', validateOtp, verifyOtp);

// Password management
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Customer profile management
router.get('/getCustomers', protect, authorize('admin'), getCustomers);
router.get('/:id', protect, getCustomer);
router.get('/me', protect, getMe);
router.put('/update/:id', protect, upload.single('profilePicture'), updateCustomer);
router.put('/updatePassword/:id', protect, updatePassword);
router.delete('/:id', protect, authorize('admin'), deleteCustomer);

// Upload profile image
router.post(
    '/uploadImage',
    protect,
    authorize('admin', 'customer'),
    upload.single('profilePicture'),
    uploadImage
);

module.exports = router;