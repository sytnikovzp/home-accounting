const fs = require('fs');
const path = require('path');

const multer = require('multer');

const {
  configs: {
    STATIC: { PATH },
    FILES: { IMAGE_MIMETYPE, IMAGE_EXTENSIONS, MAX_FILE_SIZE },
  },
} = require('../constants');

const createStorage = (subfolder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        PATH,
        'images',
        subfolder
      );
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const cleanName = file.originalname.replace(/\s+/g, '-');
      cb(null, `${timestamp}-${cleanName}`);
    },
  });

const createFileFilter =
  (allowedMimeTypes, allowedExtensions) => (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase().slice(1);
    if (
      !allowedMimeTypes.test(file.mimetype) ||
      !allowedExtensions.includes(extension)
    ) {
      const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
      error.message = `Неприпустимий формат файлу. Дозволені формати файлів: ${allowedExtensions.join(', ')}.`;
      return cb(error, false);
    }
    return cb(null, true);
  };

const createUploader = (subfolder, mimeRegexp, fileExtensions, maxSize) =>
  multer({
    fileFilter: createFileFilter(mimeRegexp, fileExtensions),
    limits: { fileSize: maxSize },
    storage: createStorage(subfolder),
  });

module.exports.uploadEstablishmentLogo = createUploader(
  'establishments',
  IMAGE_MIMETYPE,
  IMAGE_EXTENSIONS,
  MAX_FILE_SIZE
);
module.exports.uploadUserPhoto = createUploader(
  'users',
  IMAGE_MIMETYPE,
  IMAGE_EXTENSIONS,
  MAX_FILE_SIZE
);
