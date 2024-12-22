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
    description: 'Повний CRUD для одиниць вимірів без модерації',
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
    title: 'MODERATION_SHOPS',
    description: 'Перегляд та зміна статусу публікації для магазинів',
  },
  {
    title: 'ADD_PRODUCTS',
    description: 'Додавання нових товарів, потребують модерації',
  },
  {
    title: 'MODERATION_PRODUCTS',
    description: 'Перегляд та зміна статусу публікації для товарів',
  },
  {
    title: 'ADD_CATEGORIES',
    description: 'Додавання нових категорій, потребують модерації',
  },
  {
    title: 'MODERATION_CATEGORIES',
    description: 'Перегляд та зміна статусу публікації для категорій',
  },
];

module.exports.roles = async (permissionUuids) => [
  {
    title: 'Administrator',
    description: 'Має повний доступ до керування користувачами та ролями',
    permissions: [
      permissionUuids['MANAGE_ROLES'],
      permissionUuids['ASSIGN_ROLES'],
      permissionUuids['MANAGE_USER_PROFILES'],
      permissionUuids['FULL_PROFILE_VIEWER'],
    ],
  },
  {
    title: 'Moderator',
    description: 'Моніторинг та відстеження публікацій й контенту',
    permissions: [
      permissionUuids['MANAGE_CATEGORIES'],
      permissionUuids['MANAGE_PRODUCTS'],
      permissionUuids['MANAGE_SHOPS'],
      permissionUuids['MANAGE_CURRENCIES'],
      permissionUuids['MANAGE_MEASURES'],
      permissionUuids['MODERATION_CATEGORIES'],
      permissionUuids['MODERATION_PRODUCTS'],
      permissionUuids['MODERATION_SHOPS'],
      permissionUuids['LIMITED_PROFILE_VIEWER'],
    ],
  },
  {
    title: 'User',
    description: 'Використання цього додатку для відстеження покупок',
    permissions: [
      permissionUuids['ADD_PURCHASES'],
      permissionUuids['ADD_SHOPS'],
      permissionUuids['ADD_PRODUCTS'],
      permissionUuids['ADD_CATEGORIES'],
      permissionUuids['LIMITED_PROFILE_VIEWER'],
    ],
  },
];

module.exports.users = async (roleUuids) => [
  {
    fullName: 'Іван Петренко',
    email: 'ivan.petrenko@gmail.com',
    photo: '1730686056955-ivan.petrenko.jpg',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    emailVerificationStatus: 'verified',
    roleUuid: roleUuids['Administrator'],
  },
  {
    fullName: 'Олександра Іванчук',
    email: 'o.ivanchuk@gmail.com',
    photo: '1730686066968-oleksandra.ivanchuk.jpg',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    emailVerificationStatus: 'verified',
    roleUuid: roleUuids['Moderator'],
  },
  {
    fullName: 'Ганна Шевченко',
    email: 'hanna.shevchenko@gmail.com',
    photo: '1730713464386-hanna.shevchenko.jpg',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    emailVerificationStatus: 'verified',
    roleUuid: roleUuids['User'],
  },
];
