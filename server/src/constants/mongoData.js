const bcrypt = require('bcrypt');
// ==============================================================
const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');

module.exports.permissions = [
  {
    title: 'Change roles',
    description: 'Change roles for users',
  },
  {
    title: 'Change permission',
    description: 'Change permissions for roles',
  },
  {
    title: 'Full view of user profiles',
    description: 'View full information about other user profiles',
  },
  {
    title: 'Limited viewing of user profiles',
    description:
      'View limited information about other user profiles (id, name, role, photo)',
  },
  {
    title: 'Full view of own profile',
    description: 'View full information about own profile',
  },
  {
    title: 'Edit or delete own profile',
    description: 'Edit or delete own profile information',
  },
  {
    title: 'Edit or delete other users profiles',
    description:
      'Edit or delete information about other users (users are created during registration)',
  },
  {
    title: 'Publish content',
    description: 'Approve or reject content publication',
  },
  {
    title: 'Edit content',
    description: 'Edit existing content',
  },
  {
    title: 'Delete content',
    description: 'Delete existing content',
  },
  {
    title: 'Create or update purchase',
    description:
      'Create or update purchase records based on existing entities without moderation',
  },
  {
    title: 'Add shops',
    description: 'Add new shops, which need to be moderated',
  },
  {
    title: 'Add products',
    description: 'Add new products, which need to be moderated',
  },
  {
    title: 'Add categories',
    description: 'Add new categories, which need to be moderated',
  },
  {
    title: 'Delete own records',
    description: 'Delete own records',
  },
  {
    title: 'View analytics',
    description: 'Access to all statistics and analytics on the site',
  },
];

module.exports.roles = async (permissionIds) => [
  {
    title: 'Administrator',
    description: 'He can do everything',
    permissions: [permissionIds['View analytics']],
  },
  {
    title: 'Moderator',
    description: 'He keeps order',
    permissions: [permissionIds['View analytics']],
  },
  {
    title: 'User',
    description: 'He uses application',
    permissions: [permissionIds['View analytics']],
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
    roleId: roleIds['User'],
  },
];
