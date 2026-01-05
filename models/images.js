const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: {
    type: String,
    default: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
  },
  publicId: String,
});

ImageSchema.virtual('avatarComment').get(function () {
  if (!this.url?.includes('cloudinary')) return this.url;
  return this.url.replace('/upload/', '/upload/w_25,h_25,c_fill,g_face,r_max,f_auto,q_auto/');
});

ImageSchema.virtual('avatarPostHeader').get(function () {
  if (!this.url?.includes('cloudinary')) return this.url;
  return this.url.replace('/upload/', '/upload/w_50,h_50,c_fill,g_face,r_max,f_auto,q_auto/');
});

ImageSchema.virtual('avatarProfilePage').get(function () {
  if (!this.url?.includes('cloudinary')) return this.url;
  return this.url.replace('/upload/', '/upload/w_110,h_110,c_fill,g_face,r_max,f_auto,q_auto/');
});

module.exports = mongoose.model('Image', ImageSchema);
