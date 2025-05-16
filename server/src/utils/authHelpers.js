const bcrypt = require('bcrypt');

const {
  Role,
  Permission,
  PasswordResetToken,
  ConfirmationToken,
} = require('../db/dbMongo/models');

const {
  AUTH_CONFIG: { HASH_SALT_ROUNDS },
} = require('../constants');
const { notFound } = require('../errors/generalErrors');

const hashPassword = function (password) {
  return bcrypt.hash(password, HASH_SALT_ROUNDS);
};

const confirmPassword = function (password, userPassword) {
  return bcrypt.compare(password, userPassword);
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
  hashPassword,
  confirmPassword,
  checkPermission,
  checkToken,
};
