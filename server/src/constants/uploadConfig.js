module.exports = {
  IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif'],
  IMAGE_MIMETYPE: /^image\/(jpeg|png|gif)$/,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  STATIC_PATH: process.env.STATIC_PATH,
};
