const bcrypt = require('bcrypt');
// ==============================================================
const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');

module.exports.permissions = [
  {
    title: 'change_roles',
    description: 'Change roles for users',
  },
  {
    title: 'change_permissions',
    description: 'Change permissions for roles',
  },
  {
    title: 'full_view_of_other_users_profiles',
    description: 'View full information about other user profiles',
  },
  {
    title: 'limited_viewing_of_other_user_profiles',
    description:
      'View limited information about other user profiles (id, name, role, photo)',
  },
  {
    title: 'edit_or_delete_other_users_profiles',
    description:
      'Edit or delete information about other users (users are created during registration)',
  },
  {
    title: 'publish_content',
    description: 'Approve or reject content publication',
  },
  {
    title: 'edit_content',
    description: 'Edit existing content',
  },
  {
    title: 'delete_content',
    description: 'Delete existing content',
  },
  {
    title: 'create_or_update_purchase',
    description:
      'Create or update purchase records based on existing entities without moderation',
  },
  {
    title: 'add_shops',
    description: 'Add new shops, which need to be moderated',
  },
  {
    title: 'add_products',
    description: 'Add new products, which need to be moderated',
  },
  {
    title: 'add_categories',
    description: 'Add new categories, which need to be moderated',
  },
  {
    title: 'delete_own_content',
    description: 'Delete own content records',
  },
];

module.exports.roles = async (permissionIds) => [
  {
    title: 'Administrator',
    description: 'Manages all aspects of the application',
    permissions: [
      permissionIds['change_roles'],
      permissionIds['change_permissions'],
      permissionIds['full_view_of_other_users_profiles'],
      permissionIds['edit_or_delete_other_users_profiles'],
    ],
  },
  {
    title: 'Moderator',
    description: 'Monitoring and tracking publications and content',
    permissions: [
      permissionIds['publish_content'],
      permissionIds['edit_content'],
      permissionIds['delete_content'],
      permissionIds['limited_viewing_of_other_user_profiles'],
    ],
  },
  {
    title: 'User',
    description: 'Uses an app to track purchases',
    permissions: [
      permissionIds['create_or_update_purchase'],
      permissionIds['add_shops'],
      permissionIds['add_products'],
      permissionIds['add_categories'],
      permissionIds['limited_viewing_of_other_user_profiles'],
      permissionIds['delete_own_content'],
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
