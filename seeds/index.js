const mongoose = require('mongoose');
const Post = require('../models/posts.js');
const User = require('../models/users.js');
const Comment = require('../models/comments.js');
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected!');
});

const posts = require('./posts.json');
const users = require('./users.json');
const comments = require('./comments.json');

const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seed = async () => {
  /* Delete everything in database */
  await Post.deleteMany({});
  await User.deleteMany({});
  await Comment.deleteMany({});

  //create Users
  const insertedUsers = await User.insertMany(users);
  const commentsWithAuthors = comments.map((comment) => ({
    ...comment,
    author: randomElement(insertedUsers)._id,
  }));
  const pushedComments = await Comment.insertMany(commentsWithAuthors);
  const postsWithAuthors = posts.map((post) => ({
    ...post,
    author: randomElement(insertedUsers)._id,
    comments: [],
    likes: [],
  }));

  for (const post of postsWithAuthors) {
    const randomNumOfComments = Math.floor(Math.random() * 6); // 0–5 comments
    for (let i = 0; i < randomNumOfComments; i++) {
      post.comments.push(randomElement(pushedComments)._id);
    }
  }

  await Post.insertMany(postsWithAuthors);
  console.log('Database seeded!');
  mongoose.connection.close();
};

seed();
