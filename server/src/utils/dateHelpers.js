const { format, parse, isValid, isBefore, parseISO } = require('date-fns');
const { uk } = require('date-fns/locale');

const { badRequest } = require('../errors/generalErrors');

const stripTime = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDateTime = function (date) {
  if (!date) {
    return null;
  }
  return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: uk });
};

const formatDate = function (date) {
  if (!date) {
    return null;
  }
  return format(new Date(date), 'dd MMMM yyyy', { locale: uk });
};

const parseAndValidateDate = function (dateValue) {
  if (!dateValue) {
    return null;
  }
  const date = parse(dateValue, 'dd MMMM yyyy', new Date(), { locale: uk });
  if (!isValid(date)) {
    throw badRequest('Невірний формат дати');
  }
  return date;
};

const parseDateString = (value, originalValue) => {
  if (typeof originalValue === 'string') {
    const trimmed = originalValue.trim();
    if (trimmed === '') {
      return null;
    }
    const parsedDate = parse(trimmed, 'dd MMMM yyyy', new Date(), {
      locale: uk,
    });
    return isValid(parsedDate) ? parsedDate : null;
  }
  return originalValue;
};

const isBeforeCurrentDate = (value) => {
  if (!value) {
    return;
  }
  const currentDate = new Date();
  if (!isBefore(parseISO(value), currentDate)) {
    throw new Error('Дата не може бути у майбутньому');
  }
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

module.exports = {
  stripTime,
  formatDateTime,
  formatDate,
  parseAndValidateDate,
  parseDateString,
  isBeforeCurrentDate,
  getTime,
};
