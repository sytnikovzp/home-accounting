const bcrypt = require('bcrypt');
const { uk } = require('date-fns/locale');
const { format } = require('date-fns');
// ==============================================================
const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');
// ==============================================================
const { User, Role } = require('../db/dbMongo/models');
// ==============================================================
const { notFound } = require('../errors/customErrors');

const hashPassword = async function (password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const setRefreshTokenCookie = function (res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    maxAge: 60 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
};

const formatDate = function (date) {
  return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: uk });
};

const getTime = function (ago = 'allTime') {
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

const emailToLowerCase = function (email) {
  return email.toLowerCase();
};

const checkPermission = async function (user, requiredPermission) {
  const foundRole = await Role.findOne({ title: user.role }).populate(
    'permissions'
  );
  if (!foundRole) throw notFound('Роль для користувача не знайдено');
  const permissions = foundRole.permissions.map((p) => p.title);
  return permissions.includes(requiredPermission);
};

const getRecordByTitle = async function (Model, title) {
  if (!title) return null;
  const record = await Model.findOne({
    where: { title },
    attributes: ['id', 'title'],
    raw: true,
  });
  if (!record) throw notFound(`${Model.name} not found`);
  return record;
};

const getUserDetailsByEmail = async function (email) {
  const user = await User.findOne({ email });
  if (!user) return null;
  return {
    id: user._id.toString(),
    fullName: user.fullName,
  };
};

module.exports = {
  hashPassword,
  setRefreshTokenCookie,
  formatDate,
  getTime,
  emailToLowerCase,
  checkPermission,
  getRecordByTitle,
  getUserDetailsByEmail,
};
