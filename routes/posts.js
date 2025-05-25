const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// CRUD posts
router.post('/', isAuthenticated, postController.createPost);
router.get('/', isAuthenticated, postController.getFeed);
router.get('/:postId', isAuthenticated, postController.getPost);
router.put('/:postId', isAuthenticated, postController.updatePost);
router.delete('/:postId', isAuthenticated, postController.deletePost);

// Likes
router.post('/:postId/like', isAuthenticated, postController.likePost);
router.post('/:postId/unlike', isAuthenticated, postController.unlikePost);

module.exports = router;

