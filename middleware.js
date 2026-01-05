const Post = require('./models/posts.js');
const User = require('./models/users.js');
const Comment = require('./models/comments.js');
const ExpressError = require('./utils/ExpressError.js');
const { postSchema, userSchema } = require('./schemas.js');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.originalUrl) {
      req.session.returnTo = req.originalUrl;
    }
    req.flash('error', 'Bitte logge dich ein.');
    return res.redirect('/login');
  }
  next();
};

module.exports.isPostAuthor = async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  console.log(post);
  if (!post.author.equals(req.user._id)) {
    req.flash('error', 'Dafür haben Sie keine Berechtigung.');
    return res.redirect(`/posts/${postId}`);
  }
  next();
};

module.exports.isProfileOwner = async (req, res, next) => {
  const { username } = req.params;
  const targetUser = await User.findOne({ username });

  if (!targetUser) {
    req.flash('error', 'Benutzer nicht gefunden.');
    return res.redirect('/posts');
  }

  if (!targetUser._id.equals(req.user._id)) {
    req.flash('error', 'Dafür haben Sie keine Berechtigung.');
    return res.redirect(`/user/${username}`);
  }
  next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
  const { commentId, postId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment.author.equals(req.user._id)) {
    req.flash('error', 'Dafür haben Sie keine Berechtigung.');
    return res.redirect(`/posts/${postId}`);
  }
  next();
};

module.exports.validateUser = (req, res, next) => {
  if (!req.body) req.body = {};
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validatePost = (req, res, next) => {
  if (!req.body) req.body = {};
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
