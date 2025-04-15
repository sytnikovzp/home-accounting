const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '..', '.env'),
});

module.exports.API_CONFIG = require('./apiConfig');
module.exports.AUTH_CONFIG = require('./authConfig');
module.exports.DATA_MAPPING = require('./dataMapping');
module.exports.EMAIL_TEMPLATES = require('./emailTemplates');
module.exports.DB_CONFIG = require('./dbConfig');
module.exports.MONGO_DATA = require('./mongoData');
module.exports.POSTGRES_DATA = require('./postgresData');
module.exports.SMTP_CONFIG = require('./smtpConfig');
module.exports.TOKEN_LIFETIME = require('./tokenLifetime');
module.exports.UPLOAD_CONFIG = require('./uploadConfig');
