const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// ==============================================================
const router = require('./routers');
// ==============================================================
const {
  configs: {
    CLIENT: { URL },
    STATIC: { PATH },
  },
} = require('./constants');
// ==============================================================
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

const app = express();
const publicPath = path.resolve(__dirname, '..', '..', PATH, 'images');

app.use('/images', express.static(publicPath));

app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
    credentials: true,
    origin: URL,
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
