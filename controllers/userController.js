const express = require('express');
const User = require('../models/users');
const Image = require('../models/images');
const passport = require('passport');
const { uploadBufferAndCreateImage, destroyImage } = require('../cloudinary');

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register');
};

module.exports.renderProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate('image');
    if (!user) return res.status(404).render('404');

    const posts = await user
      .findAllPosts()
      .populate('image')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
        },
      })
      .populate({
        path: 'author',
        populate: {
          path: 'image',
        },
      });

    res.render('users/profile', { user, posts });
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
  }
};

module.exports.editProfile = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).populate('image');
  if (!user) return res.status(404).render('404');
  res.render('users/edit', { user });
};

module.exports.updateProfile = async (req, res) => {
  const { username } = req.params;
  const { bio } = req.body;
  const user = await User.findOne({ username });
  if (req.file) {
    const oldImage = await Image.findById(user.image);
    await destroyImage(oldImage);

    const image = await uploadBufferAndCreateImage(req.file.buffer);
    user.image = image;
  }
  console.log(user);
  user.bio = bio;
  await user.save();
  res.redirect(`/profile/${username}`);
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, displayname } = req.body;
    const user = new User({ username, email, displayname });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Willkommen bei Pixel!');
      return res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

module.exports.login = (req, res, next) => {
  passport.authenticate(
    'local',
    {
      failureRedirect: '/login',
      failureFlash: req.flash('error', `Benutzername oder Passwort falsch!`),
    },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect('/login');

      req.logIn(user, (err) => {
        if (err) return next(err);
        req.flash('success', `Willkommen zurück, ${user.username}!`);
        return res.redirect('/posts');
      });
    }
  )(req, res, next);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
