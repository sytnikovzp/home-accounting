const path = require('path');
const mongoose = require('mongoose');
const {
  mongoData: { roles, users },
} = require('../constants');
const { User, Role } = require('../db/dbMongo/models');

const env = process.env.NODE_ENV || 'development';
const configPath = path.resolve('src', 'config', 'mongoConfig.js');
const config = require(configPath)[env];

const createRoles = async () => {
  const createdRoles = await Role.insertMany(roles);
  const roleIds = {};
  createdRoles.forEach((role) => {
    roleIds[role.title] = role._id;
  });
  return roleIds;
};

const createUsers = async (roleIds) => {
  const usersToInsert = await users(roleIds);
  await User.create(usersToInsert);
};

const setupDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb://${config.host}:${config.port}/${config.dbName}`
    );
    console.log(`Connected to ${config.dbName} database`);
    await Role.deleteMany({});
    await User.deleteMany({});
    const roleIds = await createRoles();
    await createUsers(roleIds);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Setup error:', error.message);
  }
};

const teardownDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Teardown error:', error);
  }
};

module.exports = { setupDatabase, teardownDatabase };
