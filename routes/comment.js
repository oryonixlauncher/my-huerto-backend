const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/:postId', isAuthenticated, commentController.addComment);
router.put('/:commentId', isAuthenticated, commentController.updateComment);
router.delete('/:commentId', isAuthenticated, commentController.deleteComment);

// Reactions (emoji ou texte) sur commentaires
router.post('/:commentId/react', isAuthenticated, commentController.reactToComment);

module.exports = router;

