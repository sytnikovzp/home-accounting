const path = require('path');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const {
  API_CONFIG: { CLIENT_URL },
  UPLOAD_CONFIG: { STATIC_PATH },
} = require('./constants');
const {
  time: { getTime, showTime },
} = require('./middlewares');
const {
  errorHandlers: {
    authErrorHandler,
    generalErrorHandler,
    validationErrorHandler,
    sequelizeErrorHandler,
    uploadErrorHandler,
    errorHandler,
  },
} = require('./middlewares');

const router = require('./routers');

const app = express();
const publicPath = path.resolve(__dirname, '..', '..', STATIC_PATH, 'images');

app.use('/images', express.static(publicPath));

app.use(
  cors({
    credentials: true,
    exposedHeaders: ['X-Total-Count', 'X-Total-Sum'],
    origin: CLIENT_URL,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(getTime, showTime);

app.use(morgan('dev'));

app.use('/api', router);

app.use(
  authErrorHandler,
  generalErrorHandler,
  validationErrorHandler,
  sequelizeErrorHandler,
  uploadErrorHandler,
  errorHandler
);

module.exports = app;
