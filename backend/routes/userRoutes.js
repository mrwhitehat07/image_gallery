const express = require('express');
const router = express.Router();
const {
    authUser, 
    registerUser, 
    verifyEmail, 
    verifyToken,
    getUserProfile, 
    updateUserProfile, 
    getUsers, 
    deleteUser, 
    getUserByID, 
    updateUser,
    resetPassword,
    forgotPassword,
} = require('../controllers/userController');
const {admin, protect} =require('../middleware/authMiddleware');

router.route('/').post(registerUser).get( protect, admin, getUsers);

router.post('/login', authUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.route('/verify').post(protect, verifyEmail);

router.route('/verify/:token').get(verifyToken);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserByID).put(protect, admin, updateUser);

module.exports = router;