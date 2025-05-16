const emailToLowerCase = function (email) {
  return email.toLowerCase();
};

const mapValue = function (value, mapping) {
  return mapping[value] || value;
};

module.exports = {
  emailToLowerCase,
  mapValue,
};
