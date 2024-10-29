const { format } = require('date-fns');

module.exports.formatDate = function (date) {
  return format(new Date(date), 'dd MMMM yyyy, HH:mm');
};

module.exports.emailToLowerCase = function (email) {
  return email.toLowerCase();
};
