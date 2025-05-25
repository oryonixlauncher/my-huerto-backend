const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Routes principales des posts
router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// Likes
router.post('/:id/like', postController.toggleLike);

// Commentaires
router.post('/:id/comments', postController.addComment);

module.exports = router;

