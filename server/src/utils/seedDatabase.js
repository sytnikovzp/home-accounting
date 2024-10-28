const {
  mongoData: { roles, users },
} = require('../constants');
// ==============================================================
const { User, Role } = require('../db/dbMongo/models');

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

module.exports.seedMongoDB = async () => {
  try {
    const roleIds = await createRoles();
    await createUsers(roleIds);
    console.log('MongoDB seeded successfully!');
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
};
