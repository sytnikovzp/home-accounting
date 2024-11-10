const bcrypt = require('bcrypt');
// ==============================================================
const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');

module.exports.permissions = [
  {
    title: 'MANAGE_ROLES',
    description: 'Full CRUD for user roles',
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
    title: 'FULL_PROFILE_VIEWER',
    description: 'View full information about other user profiles',
  },
  {
    title: 'LIMITED_PROFILE_VIEWER',
    description:
      'View limited information about other user profiles (id, name, role, photo)',
  },
  {
    title: 'MANAGE_USER_PROFILES',
    description: 'Edit or delete information about other users',
  },
  {
    title: 'PUBLISH_CONTENT',
    description: 'Approve or reject content publication',
  },
  {
    title: 'MANAGE_CATEGORIES',
    description: 'Full CRUD operations on category entities without moderation',
  },
  {
    title: 'MANAGE_PRODUCTS',
    description: 'Full CRUD operations on product entities without moderation',
  },
  {
    title: 'MANAGE_SHOPS',
    description: 'Full CRUD operations on shop entities without moderation',
  },
  {
    title: 'MANAGE_CURRENCIES',
    description: 'Full CRUD operations on currency entities without moderation',
  },
  {
    title: 'MANAGE_MEASURES',
    description: 'Full CRUD operations on measure entities without moderation',
  },
  {
    title: 'MANAGE_PURCHASES',
    description:
      'Full CRUD for your own purchase records based on existing entities without moderation',
  },
  {
    title: 'ADD_SHOPS',
    description: 'Add new shops, which need to be moderated',
  },
  {
    title: 'MODERATE_SHOPS',
    description: 'Review and change publication status for shops',
  },
  {
    title: 'ADD_PRODUCTS',
    description: 'Add new products, which need to be moderated',
  },
  {
    title: 'MODERATE_PRODUCTS',
    description: 'Review and change publication status for products',
  },
  {
    title: 'ADD_CATEGORIES',
    description: 'Add new categories, which need to be moderated',
  },
  {
    title: 'MODERATE_CATEGORIES',
    description: 'Review and change publication status for categories',
  },
];

module.exports.roles = async (permissionIds) => [
  {
    title: 'Administrator',
    description: 'Manages all aspects of the application',
    permissions: [
      permissionIds['MANAGE_ROLES'],
      permissionIds['CHANGE_ROLES'],
      permissionIds['CHANGE_PERMISSIONS'],
      permissionIds['MANAGE_USER_PROFILES'],
      permissionIds['FULL_PROFILE_VIEWER'],
    ],
  },
  {
    title: 'Moderator',
    description: 'Monitoring and tracking publications and content',
    permissions: [
      permissionIds['PUBLISH_CONTENT'],
      permissionIds['MANAGE_CATEGORIES'],
      permissionIds['MANAGE_PRODUCTS'],
      permissionIds['MANAGE_SHOPS'],
      permissionIds['MANAGE_CURRENCIES'],
      permissionIds['MANAGE_MEASURES'],
      permissionIds['MODERATE_SHOPS'],
      permissionIds['MODERATE_PRODUCTS'],
      permissionIds['MODERATE_CATEGORIES'],
      permissionIds['LIMITED_PROFILE_VIEWER'],
    ],
  },
  {
    title: 'User',
    description: 'Uses an app to track purchases',
    permissions: [
      permissionIds['MANAGE_PURCHASES'],
      permissionIds['ADD_SHOPS'],
      permissionIds['ADD_PRODUCTS'],
      permissionIds['ADD_CATEGORIES'],
      permissionIds['LIMITED_PROFILE_VIEWER'],
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
