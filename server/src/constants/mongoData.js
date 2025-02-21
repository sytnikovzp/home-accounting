const bcrypt = require('bcrypt');

const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');

module.exports.permissions = [
  {
    title: 'ADD_ROLES',
    description: 'Додавання нових ролей користувачів',
  },
  {
    title: 'EDIT_ROLES',
    description: 'Редагування ролей користувачів',
  },
  {
    title: 'REMOVE_ROLES',
    description: 'Видалення ролей користувачів',
  },
  {
    title: 'ASSIGN_ROLES',
    description: 'Призначення та зміна ролей користувачам',
  },
  {
    title: 'EDIT_USERS',
    description: 'Редагування облікових записів користувачів',
  },
  {
    title: 'REMOVE_USERS',
    description: 'Видалення облікових записів користувачів',
  },
  {
    title: 'ADD_CATEGORIES',
    description: 'Додавання нових категорій',
  },
  {
    title: 'EDIT_CATEGORIES',
    description: 'Редагування категорій',
  },
  {
    title: 'REMOVE_CATEGORIES',
    description: 'Видалення категорій',
  },
  {
    title: 'MODERATION_CATEGORIES',
    description: 'Зміна статусу публікації та модерація категорій',
  },
  {
    title: 'ADD_ESTABLISHMENTS',
    description: 'Додавання нових закладів',
  },
  {
    title: 'EDIT_ESTABLISHMENTS',
    description: 'Редагування закладів',
  },
  {
    title: 'REMOVE_ESTABLISHMENTS',
    description: 'Видалення закладів',
  },
  {
    title: 'MODERATION_ESTABLISHMENTS',
    description: 'Зміна статусу публікації та модерація закладів',
  },
  {
    title: 'ADD_PRODUCTS',
    description: 'Додавання нових товарів',
  },
  {
    title: 'EDIT_PRODUCTS',
    description: 'Редагування товарів',
  },
  {
    title: 'REMOVE_PRODUCTS',
    description: 'Видалення товарів',
  },
  {
    title: 'MODERATION_PRODUCTS',
    description: 'Зміна статусу публікації та модерація товарів',
  },
  {
    title: 'ADD_CURRENCIES',
    description: 'Додавання нових валют',
  },
  {
    title: 'EDIT_CURRENCIES',
    description: 'Редагування валют',
  },
  {
    title: 'REMOVE_CURRENCIES',
    description: 'Видалення валют',
  },
  {
    title: 'ADD_MEASURES',
    description: 'Додавання нових одиниць вимірів',
  },
  {
    title: 'EDIT_MEASURES',
    description: 'Редагування одиниць вимірів',
  },
  {
    title: 'REMOVE_MEASURES',
    description: 'Видалення одиниць вимірів',
  },
  {
    title: 'ADD_EXPENSES',
    description: 'Додавання нових записів про витрати',
  },
  {
    title: 'EDIT_EXPENSES',
    description: 'Редагування записів про витрати',
  },
  {
    title: 'REMOVE_EXPENSES',
    description: 'Видалення записів про витрати',
  },
  {
    title: 'FULL_PROFILE_VIEWER',
    description: 'Перегляд повної інформації в профілях інших користувачів',
  },
  {
    title: 'LIMITED_PROFILE_VIEWER',
    description: 'Перегляд обмеженої інформації в профілях інших користувачів',
  },
];

module.exports.roles = (permissionUuids) => [
  {
    title: 'Administrators',
    description: 'Має повний доступ до керування користувачами та ролями',
    permissions: [
      permissionUuids['ADD_ROLES'],
      permissionUuids['EDIT_ROLES'],
      permissionUuids['REMOVE_ROLES'],
      permissionUuids['ASSIGN_ROLES'],
      permissionUuids['EDIT_USERS'],
      permissionUuids['REMOVE_USERS'],
      permissionUuids['FULL_PROFILE_VIEWER'],
    ],
  },
  {
    title: 'Moderators',
    description: 'Моніторинг та відстеження публікацій й контенту',
    permissions: [
      permissionUuids['ADD_CATEGORIES'],
      permissionUuids['EDIT_CATEGORIES'],
      permissionUuids['REMOVE_CATEGORIES'],
      permissionUuids['ADD_ESTABLISHMENTS'],
      permissionUuids['EDIT_ESTABLISHMENTS'],
      permissionUuids['REMOVE_ESTABLISHMENTS'],
      permissionUuids['ADD_PRODUCTS'],
      permissionUuids['EDIT_PRODUCTS'],
      permissionUuids['REMOVE_PRODUCTS'],
      permissionUuids['ADD_CURRENCIES'],
      permissionUuids['EDIT_CURRENCIES'],
      permissionUuids['REMOVE_CURRENCIES'],
      permissionUuids['ADD_MEASURES'],
      permissionUuids['EDIT_MEASURES'],
      permissionUuids['REMOVE_MEASURES'],
      permissionUuids['MODERATION_CATEGORIES'],
      permissionUuids['MODERATION_PRODUCTS'],
      permissionUuids['MODERATION_ESTABLISHMENTS'],
      permissionUuids['LIMITED_PROFILE_VIEWER'],
    ],
  },
  {
    title: 'Users',
    description: 'Використання цього додатку для відстеження витрат',
    permissions: [
      permissionUuids['ADD_EXPENSES'],
      permissionUuids['EDIT_EXPENSES'],
      permissionUuids['REMOVE_EXPENSES'],
      permissionUuids['ADD_ESTABLISHMENTS'],
      permissionUuids['EDIT_ESTABLISHMENTS'],
      permissionUuids['ADD_PRODUCTS'],
      permissionUuids['EDIT_PRODUCTS'],
      permissionUuids['ADD_CATEGORIES'],
      permissionUuids['EDIT_CATEGORIES'],
      permissionUuids['LIMITED_PROFILE_VIEWER'],
    ],
  },
];

module.exports.users = async (roleUuids) => [
  {
    email: 'i.petrenko@gmail.com',
    emailConfirm: 'confirmed',
    fullName: 'Іван Петренко',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    photo: '1730686056955-ivan.petrenko.jpg',
    roleUuid: roleUuids['Administrators'],
  },
  {
    email: 'o.ivanchuk@gmail.com',
    emailConfirm: 'confirmed',
    fullName: 'Олександра Іванчук',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    photo: '1730686066968-oleksandra.ivanchuk.jpg',
    roleUuid: roleUuids['Moderators'],
  },
  {
    email: 'a.shevchenko@gmail.com',
    emailConfirm: 'confirmed',
    fullName: 'Ганна Шевченко',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    photo: '1730713464386-hanna.shevchenko.jpg',
    roleUuid: roleUuids['Users'],
  },
  {
    email: 'e.kovalenko@gmail.com',
    emailConfirm: 'confirmed',
    fullName: 'Євген Коваленко',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    photo: '1730713568386-evgen.kovalenko.jpg',
    roleUuid: roleUuids['Users'],
  },
  {
    email: 'm.scherbak@gmail.com',
    emailConfirm: 'confirmed',
    fullName: 'Микола Щербак',
    password: await bcrypt.hash('Qwerty12', SALT_ROUNDS),
    photo: '1730743569326-mykola.scherbak.jpg',
    roleUuid: roleUuids['Users'],
  },
];
