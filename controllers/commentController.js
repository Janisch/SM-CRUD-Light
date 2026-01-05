const Post = require('../models/posts.js');
const Comment = require('../models/comments.js');

module.exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const text = req.body.comment.body.trim();
  const comment = await Comment.create({
    body: text,
    author: req.user,
    likes: [req.user],
  });

  const post = await Post.findById(postId);
  post.addComment(comment._id);
  await post.save();
  res.redirect(`/posts/${postId}`);
};

module.exports.likeComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  comment.toggleLikeById(req.user._id);
  comment.save();
  res.redirect(`/posts/${postId}`);
};

module.exports.createReplyComment = async (req, res) => {
  const { postId } = req.params;
  const comment = await Comment.create({
    ...req.body.comment,
    author: req.user,
    likes: [req.user],
  });
  const motherComment = await Comment.findById(req.params.commentId);
  if (motherComment.parentComment) {
    const parentComment = await Comment.findById(motherComment.parentComment);
    await parentComment.addReply(comment);
  } else {
    await motherComment.addReply(comment);
  }
  res.redirect(`/posts/${postId}`);
};

module.exports.destroyComment = async (req, res) => {
  const { commentId, postId } = req.params;
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/posts/${postId}`);
};
