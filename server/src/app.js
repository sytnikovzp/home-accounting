const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// =====================================
const router = require('./routers');
// =====================================
const {
  time: { getTime, showTime },
} = require('./middlewares');
const {
  errorHandlers: { errorHandler },
} = require('./middlewares');

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(getTime, showTime);

app.use(morgan('dev'));

app.use('/api', router);

app.use(errorHandler);

module.exports = app;
