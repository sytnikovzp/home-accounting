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
    description: 'Повний CRUD для ролей користувачів',
  },
  {
    title: 'ASSIGN_ROLES',
    description: 'Зміна ролей для користувачів',
  },
  {
    title: 'FULL_PROFILE_VIEWER',
    description: 'Перегляд повної інформації в профілях інших користувачів',
  },
  {
    title: 'LIMITED_PROFILE_VIEWER',
    description: 'Перегляд обмеженої інформації в профілях інших користувачів',
  },
  {
    title: 'MANAGE_USER_PROFILES',
    description: 'Повний CRUD інформації в профілях інших користувачів',
  },
  {
    title: 'MANAGE_CATEGORIES',
    description: 'Повний CRUD для категорій без модерації',
  },
  {
    title: 'MANAGE_PRODUCTS',
    description: 'Повний CRUD для товарів без модерації',
  },
  {
    title: 'MANAGE_SHOPS',
    description: 'Повний CRUD для магазинів без модерації',
  },
  {
    title: 'MANAGE_CURRENCIES',
    description: 'Повний CRUD для валют без модерації',
  },
  {
    title: 'MANAGE_MEASURES',
    description: 'Повний CRUD для одиниці вимірювань без модерації',
  },
  {
    title: 'ADD_PURCHASES',
    description: 'Додавання нових записів про покупки без модерації',
  },
  {
    title: 'ADD_SHOPS',
    description: 'Додавання нових магазинів, потребують модерації',
  },
  {
    title: 'MODERATE_SHOPS',
    description: 'Перегляд та зміна статусу публікації для магазинів',
  },
  {
    title: 'ADD_PRODUCTS',
    description: 'Додавання нових товарів, потребують модерації',
  },
  {
    title: 'MODERATE_PRODUCTS',
    description: 'Перегляд та зміна статусу публікації для товарів',
  },
  {
    title: 'ADD_CATEGORIES',
    description: 'Додавання нових категорій, потребують модерації',
  },
  {
    title: 'MODERATE_CATEGORIES',
    description: 'Перегляд та зміна статусу публікації для категорій',
  },
];

module.exports.roles = async (permissionIds) => [
  {
    title: 'Administrator',
    description: 'Має повний доступ до керування користувачами та ролями',
    permissions: [
      permissionIds['MANAGE_ROLES'],
      permissionIds['ASSIGN_ROLES'],
      permissionIds['MANAGE_USER_PROFILES'],
      permissionIds['FULL_PROFILE_VIEWER'],
    ],
  },
  {
    title: 'Moderator',
    description: 'Моніторинг та відстеження публікацій й контенту',
    permissions: [
      permissionIds['MANAGE_CATEGORIES'],
      permissionIds['MANAGE_PRODUCTS'],
      permissionIds['MANAGE_SHOPS'],
      permissionIds['MANAGE_CURRENCIES'],
      permissionIds['MANAGE_MEASURES'],
      permissionIds['MODERATE_CATEGORIES'],
      permissionIds['MODERATE_PRODUCTS'],
      permissionIds['MODERATE_SHOPS'],
      permissionIds['LIMITED_PROFILE_VIEWER'],
    ],
  },
  {
    title: 'User',
    description: 'Використання цього додатку для відстеження покупок',
    permissions: [
      permissionIds['ADD_PURCHASES'],
      permissionIds['ADD_SHOPS'],
      permissionIds['ADD_PRODUCTS'],
      permissionIds['ADD_CATEGORIES'],
      permissionIds['LIMITED_PROFILE_VIEWER'],
    ],
  },
];

module.exports.users = async (roleIds) => [
  {
    fullName: 'Іван Петренко',
    email: 'ivan.petrenko@gmail.com',
    photo: '1730686056955-ivan.petrenko.jpg',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    isActivated: true,
    roleId: roleIds['Administrator'],
  },
  {
    fullName: 'Олександра Іванчук',
    email: 'o.ivanchuk@gmail.com',
    photo: '1730686066968-oleksandra.ivanchuk.jpg',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    isActivated: true,
    roleId: roleIds['Moderator'],
  },
  {
    fullName: 'Ганна Шевченко',
    email: 'hanna.shevchenko@gmail.com',
    photo: '1730713464386-hanna.shevchenko.jpg',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    isActivated: true,
    roleId: roleIds['User'],
  },
];
