const path = require('path');
const mongoose = require('mongoose');
const {
  mongoData: { roles, users, permissions },
} = require('../constants');
const { User, Role, Permission } = require('../db/dbMongo/models');

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

const createPermissions = async () => {
  const createdPermissions = await Permission.insertMany(permissions);
  const permissionIds = {};
  createdPermissions.forEach((permission) => {
    permissionIds[permission.title] = permission._id;
  });
  return permissionIds;
};

const createRoles = async (permissionIds) => {
  const rolesWithPermissions = await roles(permissionIds);
  const createdRoles = await Role.insertMany(rolesWithPermissions);
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
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    const permissionIds = await createPermissions();
    const roleIds = await createRoles(permissionIds);
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
