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

const storageUserImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(staticPath, 'images', 'users'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const filterUserImage = (req, file, cb) => {
  const MIMETYPE_REGEXP = /^image\/(jpeg|png|gif)$/;
  if (MIMETYPE_REGEXP.test(file.mimetype)) {
    return cb(null, true);
  }
  cb(null, false);
};

module.exports.uploadUserImages = multer({
  storage: storageUserImage,
  fileFilter: filterUserImage,
});
