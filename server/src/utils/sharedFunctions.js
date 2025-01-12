const axios = require('axios');
const bcrypt = require('bcrypt');
const { format } = require('date-fns');
const { uk } = require('date-fns/locale');

const {
  User,
  Role,
  Permission,
  PasswordResetToken,
  VerificationToken,
} = require('../db/dbMongo/models');

const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');
const { notFound, badRequest } = require('../errors/generalErrors');

const hashPassword = function (password) {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const verifyPassword = function (password, userPassword) {
  return bcrypt.compare(password, userPassword);
};

const setRefreshTokenCookie = function (res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    maxAge: 60 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
};

const formatDateTime = function (date) {
  return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: uk });
};

const formatDate = function (date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: uk });
};

const getTime = function (ago = 'allTime') {
  const timeAgo = new Date();
  const intervals = {
    day: () => timeAgo.setDate(timeAgo.getDate() - 1),
    week: () => timeAgo.setDate(timeAgo.getDate() - 7),
    month: () => timeAgo.setMonth(timeAgo.getMonth() - 1),
    year: () => timeAgo.setFullYear(timeAgo.getFullYear() - 1),
    allTime: () => new Date(0),
  };
  return (intervals[ago] || intervals.allTime)();
};

const emailToLowerCase = function (email) {
  return email.toLowerCase();
};

const isValidUUID = function (uuid) {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

const checkPermission = async function (user, requiredPermission) {
  const foundRole = await Role.findOne({ title: user.role.title });
  if (!foundRole) {
    throw notFound('Роль для користувача не знайдено');
  }
  const permission = await Permission.findOne({ title: requiredPermission });
  if (!permission) {
    throw notFound('Необхідного дозволу не знайдено');
  }
  const requiredPermissionUUID = permission.uuid.toString();
  const permissionUUIDs = foundRole.permissions.map((permission) => {
    const hex = permission.toString('hex');
    const uuidWithDashes = [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join('-');
    return uuidWithDashes;
  });
  const hasPermission = permissionUUIDs.includes(requiredPermissionUUID);
  return hasPermission;
};

const getRecordByTitle = async function (Model, title) {
  if (!title) {
    return null;
  }
  const record = await Model.findOne({
    where: { title },
    attributes: ['uuid', 'title'],
    raw: true,
  });
  if (!record) {
    throw notFound(`${Model.name} not found`);
  }
  return record;
};

const getCurrencyByTitle = async function (Model, title) {
  if (!title) {
    return null;
  }
  const record = await Model.findOne({
    where: { title },
    attributes: ['uuid', 'title', 'code'],
    raw: true,
  });
  if (!record) {
    throw notFound(`${Model.name} not found`);
  }
  return record;
};

const getUserDetailsByEmail = async function (email) {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  return {
    uuid: user.uuid,
    fullName: user.fullName,
  };
};

const mapValue = function (value, mapping) {
  return mapping[value] || value;
};

const getNBURates = async () => {
  const { data } = await axios.get(
    'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
  );
  return data;
};

const convertToUAH = async (amount, currencyCode) => {
  const rates = await getNBURates();
  const currency = rates.find((rate) => rate.cc === currencyCode);
  if (!currency) {
    throw badRequest(`Курс для валюти ${currencyCode} не знайдено`);
  }
  const conversionRate = currency.rate;
  const amountInUAH = (amount * conversionRate).toFixed(2);
  return amountInUAH;
};

const checkToken = async (token, type = 'reset') => {
  let checkedToken = null;
  if (type === 'reset') {
    checkedToken = await PasswordResetToken.findOne({ token });
  } else if (type === 'verify') {
    checkedToken = await VerificationToken.findOne({ token });
  } else {
    throw badRequest('Невідомий тип токена');
  }
  if (!checkedToken) {
    throw badRequest('Невірний токен або він вже не дійсний');
  }
  if (checkedToken.expiresAt < Date.now()) {
    throw badRequest('Термін дії токену закінчився');
  }
  return checkedToken;
};

module.exports = {
  hashPassword,
  verifyPassword,
  setRefreshTokenCookie,
  formatDateTime,
  formatDate,
  getTime,
  emailToLowerCase,
  isValidUUID,
  checkPermission,
  getRecordByTitle,
  getCurrencyByTitle,
  getUserDetailsByEmail,
  mapValue,
  convertToUAH,
  checkToken,
};
