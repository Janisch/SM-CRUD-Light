const Joi = require('joi');

module.exports.postSchema = Joi.object({
  post: Joi.object({
    body: Joi.string().min(3).max(2200).required(),
    comments: Joi.array(),
    likes: Joi.array(),
  }).required(),
});

module.exports.userSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9._]+$/)
    .required(),
  password: Joi.string()
    /* .min(8)
    .max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[^\s]+$/) */
    .required(),
  displayname: Joi.string().min(3).max(30).required(),
  bio: Joi.string().max(150),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(254)
    .required(),
}).required();
