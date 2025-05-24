const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/', isAuthenticated, storyController.createStory);
router.get('/', isAuthenticated, storyController.getStories);
router.get('/user/:userId', isAuthenticated, storyController.getUserStories);
router.delete('/:storyId', isAuthenticated, storyController.deleteStory);

module.exports = router;

