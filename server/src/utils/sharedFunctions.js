const { format } = require('date-fns');

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
