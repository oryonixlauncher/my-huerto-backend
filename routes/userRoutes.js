const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/profile', isAuthenticated, userController.getProfile);
router.put('/profile', isAuthenticated, userController.updateProfile);
router.put('/profile/email', isAuthenticated, userController.updateEmail);
router.put('/profile/password', isAuthenticated, userController.updatePassword);
router.post('/follow/:userId', isAuthenticated, userController.followUser);
router.post('/unfollow/:userId', isAuthenticated, userController.unfollowUser);

router.get('/search', isAuthenticated, userController.searchUsers);

module.exports = router;

