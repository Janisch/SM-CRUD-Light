const Post = require('../models/posts.js');
const { uploadBufferAndCreateImage } = require('../cloudinary');

module.exports.index = async (req, res) => {
  const posts = await Post.find({})
    .populate('author')
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
  res.render('posts/index', { posts });
};

module.exports.createPost = async (req, res) => {
  const { body } = req.body.post;
  const post = new Post({ body });
  post.author = req.user;
  if (req.file) {
    const resultImage = await uploadBufferAndCreateImage(req.file.buffer);
    post.image = resultImage;
  }

  await post.toggleLikeById(req.user._id);
  post.save();
  res.redirect('/posts');
};

module.exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  post.toggleLikeById(req.user._id);
  post.save();
  res.redirect(`/posts/${postId}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId).populate('author');
  res.render('posts/edit', { post });
};

module.exports.showPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId)
    .populate('author')
    .populate('image')
    .populate({
      path: 'author',
      populate: {
        path: 'image',
      },
    })
    .populate({
      path: 'comments',
      populate: [
        { path: 'author', populate: { path: 'image' } },
        {
          path: 'replies',
          populate: {
            path: 'author',
            populate: { path: 'image' },
          },
        },
      ],
    });

  res.render('posts/show', { post });
};

module.exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { body } = req.body.post;
  await Post.findByIdAndUpdate(postId, { body });
  res.redirect(`/posts/${postId}`);
};

module.exports.destroyPost = async (req, res) => {
  const { postId } = req.params;
  await Post.findByIdAndDelete(postId);
  res.redirect('/posts');
};
