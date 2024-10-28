const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// =====================================
const router = require('./routers');

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use('/api', router);

module.exports = app;
