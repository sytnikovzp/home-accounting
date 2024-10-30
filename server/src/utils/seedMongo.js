const path = require('path');
// ==============================================================
const mongoose = require('mongoose');
// ==============================================================
const {
  mongoData: { roles, users },
} = require('../constants');
// ==============================================================
const { User, Role } = require('../db/dbMongo/models');

const env = process.env.NODE_ENV || 'development';
const configPath = path.resolve('src', 'config', 'mongoConfig.js');
const config = require(configPath)[env];

mongoose
  .connect(`mongodb://${config.host}:${config.port}/${config.dbName}`)
  .then(() => console.log(`Connection to DB <<< ${config.dbName} >>> is done!`))
  .catch((error) => console.log(error.message));

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

const seedMongoDB = async () => {
  try {
    await Role.deleteMany({});
    await User.deleteMany({});
    const roleIds = await createRoles();
    await createUsers(roleIds);
    console.log('MongoDB seeded successfully!');
  } catch (error) {
    console.log('Error seeding MongoDB:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedMongoDB();
