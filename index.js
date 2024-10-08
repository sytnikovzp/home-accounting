/* eslint-disable no-unused-vars */
const http = require('http');
// ====================================================
require('dotenv').config();
// ====================================================
const app = require('./src/app');
const dbPostgres = require('./src/db/dbPostgres/models');
const dbMongo = require('./src/db/dbMongo/models');
const { roles, users } = require('./src/constants/mongoData');
const { User, Role } = dbMongo;

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;

const server = http.createServer(app);

const dbCheck = async () => {
  try {
    await dbPostgres.sequelize.authenticate();
    console.log(`Connection to DB <<< ${process.env.DB_NAME} >>> is done!`);
  } catch (error) {
    console.log(
      `Can not connect to DB ${process.env.DB_NAME}: `,
      error.message
    );
  }
};

dbCheck();

const createRoles = async () => {
  await Role.insertMany(roles);
};

// createRoles();

const createUser = async () => {
  await User.create(users);
};

// createUser();

server.listen(PORT, HOST, () => {
  console.log(`Server is started on http://${HOST}:${PORT}`);
});

console.log('Server is started!');
