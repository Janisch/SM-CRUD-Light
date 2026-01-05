const dayjs = require('../utils/dayjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('../models/comments.js');

const PostSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: { type: Schema.Types.ObjectId, ref: 'Image' },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

PostSchema.virtual('likesAmount').get(function () {
  return this.likes.length;
});

PostSchema.virtual('commentsAmount').get(function () {
  let totalAmountOfComments = this.comments.length;
  for (comment of this.comments) {
    totalAmountOfComments += comment.replies.length;
  }
  return totalAmountOfComments;
});

PostSchema.methods.addComment = function (comment) {
  return this.comments.push(comment);
};

PostSchema.methods.toggleLikeById = async function (userId) {
  const userIndex = this.likes.findIndex((id) => id.toString() === userId.toString());

  if (userIndex === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(userIndex, 1);
  }
  return this;
};

PostSchema.methods.elapsedTime = function () {
  return dayjs().to(dayjs(this.createdAt));
};

PostSchema.post('findOneAndDelete', async function (doc) {
  if (!doc?.comments?.length) return;

  const comments = await Comment.find({ _id: { $in: doc.comments } });

  let replyIds = comments.flatMap((comment) => comment.replies);
  if (replyIds.length) {
    await Comment.deleteMany({ _id: { $in: replyIds } });
  }

  const commentIds = comments.map((comment) => comment._id);
  await Comment.deleteMany({ _id: { $in: commentIds } });
});

module.exports = mongoose.model('Post', PostSchema);
