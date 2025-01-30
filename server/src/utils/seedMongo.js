const path = require('path');

const mongoose = require('mongoose');

const {
  User,
  Role,
  Permission,
  PasswordResetToken,
  VerificationToken,
} = require('../db/dbMongo/models');

const {
  mongoData: { roles, users, permissions },
} = require('../constants');

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
  const permissionUuids = {};
  createdPermissions.forEach((permission) => {
    permissionUuids[permission.title] = permission.uuid;
  });
  return permissionUuids;
};

const createRoles = async (permissionUuids) => {
  const rolesWithPermissions = await roles(permissionUuids);
  const createdRoles = await Role.insertMany(rolesWithPermissions);
  const roleUuids = {};
  createdRoles.forEach((role) => {
    roleUuids[role.title] = role.uuid;
  });
  return roleUuids;
};

const createUsers = async (roleUuids) => {
  const usersToInsert = await users(roleUuids);
  await User.create(usersToInsert);
};

const seedDatabase = async () => {
  try {
    await PasswordResetToken.deleteMany({});
    await VerificationToken.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    const permissionUuids = await createPermissions();
    const roleUuids = await createRoles(permissionUuids);
    await createUsers(roleUuids);
    console.log('MongoDB database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB database connection closed');
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

module.exports = { closeDatabase, initializeDatabase };
