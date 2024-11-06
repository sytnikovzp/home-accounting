const bcrypt = require('bcrypt');
// ==============================================================
const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');

module.exports.permissions = [
  {
    title: 'CREATE_ROLES',
    description: 'Create roles for users',
  },
  {
    title: 'EDIT_ROLES',
    description: 'Edit roles for users',
  },
  {
    title: 'DELETE_ROLES',
    description: 'Delete roles for users',
  },
  {
    title: 'CHANGE_ROLES',
    description: 'Change roles for users',
  },
  {
    title: 'CHANGE_PERMISSIONS',
    description: 'Change permissions for roles',
  },
  {
    title: 'UNLIMITED_VIEW_OF_OTHER_USERS_PROFILES',
    description: 'View full information about other user profiles',
  },
  {
    title: 'LIMITED_VIEWING_OF_OTHER_USER_PROFILES',
    description:
      'View limited information about other user profiles (id, name, role, photo)',
  },
  {
    title: 'EDIT_OTHER_USERS_PROFILES',
    description: 'Edit information about other users',
  },
  {
    title: 'DELETE_OTHER_USERS_PROFILES',
    description: 'Delete information about other users',
  },
  {
    title: 'PUBLISH_CONTENT',
    description: 'Approve or reject content publication',
  },
  {
    title: 'EDIT_CONTENT',
    description: 'Edit existing content',
  },
  {
    title: 'DELETE_CONTENT',
    description: 'Delete existing content',
  },
  {
    title: 'CREATE_PURCHASE',
    description:
      'Create your own purchase records based on existing entities without moderation',
  },
  {
    title: 'EDIT_PURCHASE',
    description:
      'Edit your own purchase records based on existing entities without moderation',
  },
  {
    title: 'DELETE_PURCHASE',
    description:
      'Delete your own purchase records based on existing entities without moderation',
  },
  {
    title: 'ADD_SHOPS',
    description: 'Add new shops, which need to be moderated',
  },
  {
    title: 'ADD_PRODUCTS',
    description: 'Add new products, which need to be moderated',
  },
  {
    title: 'ADD_CATEGORIES',
    description: 'Add new categories, which need to be moderated',
  },
];

module.exports.roles = async (permissionIds) => [
  {
    title: 'Administrator',
    description: 'Manages all aspects of the application',
    permissions: [
      permissionIds['CREATE_ROLES'],
      permissionIds['EDIT_ROLES'],
      permissionIds['DELETE_ROLES'],
      permissionIds['CHANGE_ROLES'],
      permissionIds['CHANGE_PERMISSIONS'],
      permissionIds['UNLIMITED_VIEW_OF_OTHER_USERS_PROFILES'],
      permissionIds['EDIT_OTHER_USERS_PROFILES'],
      permissionIds['DELETE_OTHER_USERS_PROFILES'],
    ],
  },
  {
    title: 'Moderator',
    description: 'Monitoring and tracking publications and content',
    permissions: [
      permissionIds['PUBLISH_CONTENT'],
      permissionIds['EDIT_CONTENT'],
      permissionIds['DELETE_CONTENT'],
      permissionIds['LIMITED_VIEWING_OF_OTHER_USER_PROFILES'],
    ],
  },
  {
    title: 'User',
    description: 'Uses an app to track purchases',
    permissions: [
      permissionIds['CREATE_PURCHASE'],
      permissionIds['EDIT_PURCHASE'],
      permissionIds['DELETE_PURCHASE'],
      permissionIds['ADD_SHOPS'],
      permissionIds['ADD_PRODUCTS'],
      permissionIds['ADD_CATEGORIES'],
      permissionIds['LIMITED_VIEWING_OF_OTHER_USER_PROFILES'],
    ],
  },
];

module.exports.users = async (roleIds) => [
  {
    fullName: 'John Doe',
    email: 'john.doe@gmail.com',
    photo: '1730686056955-john.doe.jpg',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    roleId: roleIds['Administrator'],
  },
  {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@gmail.com',
    photo: '1730686066968-alex.johnson.jpg',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    roleId: roleIds['Moderator'],
  },
  {
    fullName: 'Jane Smith',
    email: 'jane.smith@gmail.com',
    photo: '1730713464386-jane.smith.jpg',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    roleId: roleIds['User'],
  },
];
