const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// ====================================================
const router = require('./routers');
// ====================================================
const {
  time: { getTime, showTime },
} = require('./middlewares');
const {
  errorHandlers: {
    authErrorHandler,
    validationErrorHandler,
    sequelizeErrorHandler,
    errorHandler,
  },
} = require('./middlewares');

const app = express();

app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(getTime, showTime);

app.use(morgan('dev'));

app.use('/api', router);

app.use(
  authErrorHandler,
  validationErrorHandler,
  sequelizeErrorHandler,
  errorHandler
);

module.exports = app;
