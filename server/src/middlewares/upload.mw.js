const path = require('path');
// ==============================================================
const multer = require('multer');
// ==============================================================
const { staticPath } = require('../config/staticConfig');

const storageShopLogo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(staticPath, 'images', 'shops'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const filterShopLogo = (req, file, cb) => {
  const MIMETYPE_REGEXP = /^image\/(jpeg|png|gif)$/;
  if (MIMETYPE_REGEXP.test(file.mimetype)) {
    return cb(null, true);
  }
  cb(null, false);
};

module.exports.uploadShopLogos = multer({
  storage: storageShopLogo,
  fileFilter: filterShopLogo,
});

const storageUserPhoto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(staticPath, 'images', 'users'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const filterUserPhoto = (req, file, cb) => {
  const MIMETYPE_REGEXP = /^image\/(jpeg|png|gif)$/;
  if (MIMETYPE_REGEXP.test(file.mimetype)) {
    return cb(null, true);
  }
  cb(null, false);
};

module.exports.uploadUserPhotos = multer({
  storage: storageUserPhoto,
  fileFilter: filterUserPhoto,
});
