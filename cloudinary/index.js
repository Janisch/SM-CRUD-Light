const cloudinary = require('cloudinary').v2;
const Image = require('../models/images.js');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(buffer);
  });
};

async function uploadBufferAndCreateImage(buffer, options = { folder: 'pixel', resource_type: 'image' }) {
  const result = await uploadBufferToCloudinary(buffer, options);

  try {
    const image = await Image.create({
      url: result.secure_url,
      publicId: result.public_id,
    });
    return image;
  } catch (err) {
    try {
      await cloudinary.uploader.destroy(result.publicId);
    } catch (_) {}
    throw err;
  }
}

async function destroyImage(image) {
  try {
    await cloudinary.uploader.destroy(image.publicId);
    await image.destroy;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  cloudinary,
  uploadBufferToCloudinary,
  uploadBufferAndCreateImage,
  destroyImage,
};
