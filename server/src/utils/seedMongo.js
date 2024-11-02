const path = require('path');
const mongoose = require('mongoose');
const {
  mongoData: { roles, users },
} = require('../constants');
const { User, Role } = require('../db/dbMongo/models');

const env = process.env.NODE_ENV || 'development';
const configPath = path.resolve('src', 'config', 'mongoConfig.js');
const config = require(configPath)[env];

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb://${config.host}:${config.port}/${config.dbName}`
    );
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
};

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

const seedDatabase = async () => {
  try {
    await Role.deleteMany({});
    await User.deleteMany({});
    const roleIds = await createRoles();
    await createUsers(roleIds);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

const initializeDatabase = async (closeConnection = false) => {
  await connectDatabase();
  await seedDatabase();
  if (closeConnection) {
    await closeDatabase();
  }
};

if (require.main === module) {
  initializeDatabase(true);
}

module.exports = { initializeDatabase, closeDatabase };
