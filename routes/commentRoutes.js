const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isCommentAuthor } = require('../middleware.js');
const commentController = require('../controllers/commentController.js');

router.post('/', isLoggedIn, commentController.createComment);
router.post('/:commentId/like', isLoggedIn, commentController.likeComment);
router
  .route('/:commentId')
  .post(isLoggedIn, commentController.createReplyComment)
  .delete(isLoggedIn, isCommentAuthor, commentController.destroyComment);

module.exports = router;
