const bcrypt = require('bcrypt');
const { format } = require('date-fns');
// ==============================================================
const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');
const { notFound } = require('../errors/customErrors');

module.exports.hashPassword = async function (password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

module.exports.setRefreshTokenCookie = function (res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    maxAge: 60 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
};

module.exports.formatDate = function (date) {
  return format(new Date(date), 'dd MMMM yyyy, HH:mm');
};

module.exports.getTime = function (ago = 'allTime') {
  const intervals = {
    day: () => timeAgo.setDate(timeAgo.getDate() - 1),
    week: () => timeAgo.setDate(timeAgo.getDate() - 7),
    month: () => timeAgo.setMonth(timeAgo.getMonth() - 1),
    year: () => timeAgo.setFullYear(timeAgo.getFullYear() - 1),
    allTime: () => new Date(0),
  };
  const timeAgo = new Date();
  return (intervals[ago] || intervals.allTime)();
};

module.exports.emailToLowerCase = function (email) {
  return email.toLowerCase();
};

module.exports.getRecordByTitle = async function (Model, title) {
  if (!title) return null;
  const record = await Model.findOne({
    where: { title },
    attributes: ['id', 'title'],
    raw: true,
  });
  if (!record) throw notFound(`${Model.name} not found`);
  return record;
};
