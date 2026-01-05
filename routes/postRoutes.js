const express = require('express');
const ExpressError = require('../utils/ExpressError.js');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isPostAuthor, validatePost } = require('../middleware.js');
const multer = require('multer');
const postController = require('../controllers/postController.js');
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new ExpressError('Nur PNG, JPG und JPEG sind erlaubt.'), false);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, //2 MB
});

router.route('/').get(postController.index).post(upload.single('image'), postController.createPost);
router.post('/:postId/like', isLoggedIn, postController.likePost);
router.get('/:postId/edit', isLoggedIn, isPostAuthor, postController.renderEditForm);
router
  .route('/:postId')
  .get(postController.showPost)
  .patch(isLoggedIn, isPostAuthor, validatePost, postController.updatePost)
  .delete(isLoggedIn, isPostAuthor, postController.destroyPost);
module.exports = router;
