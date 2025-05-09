const axios = require('axios');
const bcrypt = require('bcrypt');
const { format, parse, isValid, isBefore, parseISO } = require('date-fns');
const { uk } = require('date-fns/locale');

const {
  User,
  Role,
  Permission,
  PasswordResetToken,
  ConfirmationToken,
} = require('../db/dbMongo/models');

const {
  AUTH_CONFIG: { HASH_SALT_ROUNDS },
} = require('../constants');
const { notFound, badRequest } = require('../errors/generalErrors');

const hashPassword = function (password) {
  return bcrypt.hash(password, HASH_SALT_ROUNDS);
};

const confirmPassword = function (password, userPassword) {
  return bcrypt.compare(password, userPassword);
};

const setRefreshTokenCookie = function (res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 24 * 60 * 60 * 1000,
  });
};

const isBeforeCurrentDate = (value) => {
  const currentDate = new Date();
  if (!isBefore(parseISO(value), currentDate)) {
    throw new Error('Дата не може бути у майбутньому');
  }
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
    allTime: () => new Date(0),
    day: () => timeAgo.setDate(timeAgo.getDate() - 1),
    month: () => timeAgo.setMonth(timeAgo.getMonth() - 1),
    week: () => timeAgo.setDate(timeAgo.getDate() - 7),
    year: () => timeAgo.setFullYear(timeAgo.getFullYear() - 1),
  };
  return (intervals[ago] || intervals.allTime)();
};

const emailToLowerCase = function (email) {
  return email.toLowerCase();
};

const isValidUUID = function (uuid) {
  const regex = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;
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
    attributes: ['uuid', 'title'],
    raw: true,
    where: { title },
  });
  if (!record) {
    throw notFound(`${Model.name} не знайдено`);
  }
  return record;
};

const getCurrencyByTitle = async function (Model, title) {
  if (!title) {
    return null;
  }
  const record = await Model.findOne({
    attributes: ['uuid', 'title', 'code'],
    raw: true,
    where: { title },
  });
  if (!record) {
    throw notFound(`${Model.name} не знайдено`);
  }
  return record;
};

const getUserDetailsByEmail = async function (email) {
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return null;
  }
  return {
    fullName: foundUser.fullName,
    uuid: foundUser.uuid,
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

const parseDateString = (value, originalValue) => {
  if (typeof originalValue === 'string') {
    const parsedDate = parse(originalValue, 'dd MMMM yyyy', new Date(), {
      locale: uk,
    });
    return isValid(parsedDate) ? parsedDate : new Date('');
  }
  return originalValue;
};

const checkToken = async (token, type = 'reset') => {
  let checkedToken = null;
  if (type === 'reset') {
    checkedToken = await PasswordResetToken.findOne({ token });
  } else if (type === 'confirm') {
    checkedToken = await ConfirmationToken.findOne({ token });
  } else {
    return false;
  }
  if (!checkedToken || checkedToken.expiresAt < Date.now()) {
    return false;
  }
  return true;
};

module.exports = {
  isBeforeCurrentDate,
  checkPermission,
  checkToken,
  convertToUAH,
  emailToLowerCase,
  formatDate,
  formatDateTime,
  getCurrencyByTitle,
  getRecordByTitle,
  getTime,
  getUserDetailsByEmail,
  hashPassword,
  isValidUUID,
  mapValue,
  parseDateString,
  setRefreshTokenCookie,
  confirmPassword,
};
