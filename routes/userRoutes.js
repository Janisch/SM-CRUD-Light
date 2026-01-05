const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { validateUser } = require('../middleware.js');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Nur PNG, JPG und JPEG sind erlaubt.'), false);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, //2 MB
});

router.route('/login').get(userController.renderLoginForm).post(userController.login);
router.route('/register').get(userController.renderRegisterForm).post(validateUser, userController.createUser);
router
  .route('/profile/:username')
  .get(userController.renderProfile)
  .patch(upload.single('image'), userController.updateProfile);
router.get('/profile/:username/edit', userController.editProfile);
router.post('/logout', userController.logout);

module.exports = router;
