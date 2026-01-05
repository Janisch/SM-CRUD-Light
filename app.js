if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError.js');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const User = require('./models/users');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const userRoutes = require('./routes/userRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js');
const passport = require('passport');

const app = express();

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    //secure: true,
    sameSite: 'lax',
  },
};

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected!');
});

app.use('/', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts/:postId/', commentRoutes);

app.get('/', (req, res) => {
  res.redirect('/posts');
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Oh no! Something went wrong.';
  }
  res.status(statusCode).render('error', { err });
});

app.listen(3000, (req, res) => {
  console.log('Listening on Port 3000!');
});
