const bcrypt = require('bcrypt');
// ==============================================================
const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');

module.exports.roles = [
  {
    title: 'Administrator',
    description: 'He can do everything',
  },
  {
    title: 'Moderator',
    description: 'He keep order',
  },
  {
    title: 'Customer',
    description: 'He use application',
  },
];

module.exports.users = async (roleIds) => [
  {
    fullName: 'John Doe',
    email: 'john.doe@gmail.com',
    photo: null,
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    roleId: roleIds['Administrator'],
  },
  {
    fullName: 'Jane Smith',
    email: 'jane.smith@gmail.com',
    photo: null,
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    roleId: roleIds['Customer'],
  },
];
