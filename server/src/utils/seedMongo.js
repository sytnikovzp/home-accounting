const { connectMongoDB, closeMongoDB } = require('../db/dbMongo');
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
const { getUserDetailsByEmail } = require('../utils/sharedFunctions');

const createPermissions = async () => {
  const createdPermissions = await Permission.insertMany(permissions);
  return Object.fromEntries(createdPermissions.map((p) => [p.title, p.uuid]));
};

const createRoles = async (permissionUuids) => {
  const rolesWithPermissions = await roles(permissionUuids);
  const createdRoles = await Role.insertMany(rolesWithPermissions);
  return Object.fromEntries(createdRoles.map((r) => [r.title, r.uuid]));
};

const createUsers = async (roleUuids) => {
  const usersToInsert = await users(roleUuids);
  await User.create(usersToInsert);
};

let moderatorDetails = null;
let userDetails = null;

const seedDatabase = async () => {
  try {
    await connectMongoDB();

    await PasswordResetToken.deleteMany({});
    await VerificationToken.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});

    const permissionUuids = await createPermissions();
    const roleUuids = await createRoles(permissionUuids);
    await createUsers(roleUuids);

    moderatorDetails = await getUserDetailsByEmail('o.ivanchuk@gmail.com');
    userDetails = await getUserDetailsByEmail('hanna.shevchenko@gmail.com');

    console.log('MongoDB database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await closeMongoDB();
  }
};

const getSeededData = async () => {
  if (!moderatorDetails || !userDetails) {
    await seedDatabase();
  }
  return { moderatorDetails, userDetails };
};

if (require.main === module) {
  (async () => {
    await seedDatabase();
  })();
}

module.exports = { getSeededData };
