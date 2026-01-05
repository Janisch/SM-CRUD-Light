const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;
const Post = require('./posts.js');
const Image = require('./images.js');
const Comment = require('./comments.js');

const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
  },
  displayname: {
    type: String,
  },
  bio: {
    type: String,
    default: 'Hi! Ich lebe auf Obojima!',
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: [true, 'Diese Email wird bereits verwendet.'],
  },
  //default image should be changed in production to cloudinary image
  image: { type: Schema.Types.ObjectId, ref: 'Image' },
});

UserSchema.methods.findAllPosts = function () {
  return Post.find({ author: this._id });
};

UserSchema.plugin(passportLocalMongoose, {
  usernameLowerCase: true,
  populateFields: ['image'],
  errorMessages: {
    MissingPasswordError: 'Bitte gib ein Passwort ein.',
    AttemptTooSoonError: 'Versuch es später erneut.',
    TooManyAttemptsError: 'Zu viele Fehlversuche.',
    NoSaltValueStoredError: 'Interner Fehler: Passwortdaten fehlen.',
    IncorrectPasswordError: 'Benutzername oder Passwort ist falsch.',
    IncorrectUsernameError: 'Benutzername oder Passwort ist falsch.',
    MissingUsernameError: 'Bitte gib einen Benutzernamen ein.',
    UserExistsError: 'Dieser Benutzername ist bereits vergeben.',
  },
});

module.exports = mongoose.model('User', UserSchema);
