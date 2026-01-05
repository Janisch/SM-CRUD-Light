const mongoose = require('mongoose');
const dayjs = require('../utils/dayjs');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  likes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  replies: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    default: [],
  },

  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
});

CommentSchema.virtual('likesAmount').get(function () {
  return this.likes.length;
});

CommentSchema.methods.elapsedTime = function () {
  return dayjs(this.createdAt).fromNow();
};

CommentSchema.methods.addReply = async function (reply) {
  reply.parentComment = this;
  await reply.save();
  this.replies.push(reply);
  await this.save();
  return this;
};

CommentSchema.methods.toggleLikeById = async function (userId) {
  const userIndex = this.likes.findIndex((id) => id.toString() === userId.toString());

  if (userIndex === -1) {
    // User hat noch nicht geliked → hinzufügen
    this.likes.push(userId);
  } else {
    // User hat schon geliked → entfernen
    this.likes.splice(userIndex, 1);
  }
  return this;
};

CommentSchema.post('findOneAndDelete', async function (doc) {
  if (!doc || !(doc.replies?.length > 0)) return;

  await this.model.deleteMany({
    _id: { $in: doc.replies },
  });
});

module.exports = mongoose.model('Comment', CommentSchema);
