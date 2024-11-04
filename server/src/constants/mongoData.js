const bcrypt = require('bcrypt');
// ==============================================================
const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');

module.exports.permissions = [
  {
    title: 'Edit users',
    description:
      'Edit and delete users (users are created during registration)',
  },
  {
    title: 'View analytics',
    description: 'Access to all statistics and analytics on the site',
  },
  {
    title: 'Change roles',
    description: 'Change user roles',
  },
  {
    title: 'Publish content',
    description: 'Approve or reject content publication (all types of content)',
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
    title: 'Create purchase',
    description:
      'Create purchase records based on existing entities without moderation',
  },
  {
    title: 'Add shops',
    description: 'Add new shops, which need to be moderated',
  },
  {
    title: 'Edit own records',
    description: 'Edit own records',
  },
  {
    title: 'Delete own records',
    description: 'Delete own records',
  },
];

module.exports.roles = async (permissionIds) => [
  {
    title: 'Administrator',
    description: 'He can do everything',
    permissions: [
      permissionIds['Edit users'],
      permissionIds['View analytics'],
      permissionIds['Change roles'],
    ],
  },
  {
    title: 'Moderator',
    description: 'He keeps order',
    permissions: [
      permissionIds['Publish content'],
      permissionIds['Edit content'],
      permissionIds['Delete content'],
      permissionIds['View analytics'],
    ],
  },
  {
    title: 'User',
    description: 'He uses application',
    permissions: [
      permissionIds['Create purchase'],
      permissionIds['Add shops'],
      permissionIds['View analytics'],
      permissionIds['Edit own records'],
      permissionIds['Delete own records'],
    ],
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
