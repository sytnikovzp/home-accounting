const { createServer } = require('http');

const app = require('./src/app');
const {
  configs: {
    SERVER: { HOST, PORT },
    DATABASE: { DB_NAME },
  },
} = require('./src/constants');
const dbPostgres = require('./src/db/dbPostgres/models');

// ======================= POSTGRES DB CONNECT ========================

const postgresConnect = async () => {
  try {
    await dbPostgres.sequelize.authenticate();
    console.log(
      `Connection to PostgreSQL database <<< ${DB_NAME} >>> is done!`
    );
  } catch (error) {
    console.error(
      `Can not connect to PostgreSQL database ${DB_NAME}!`,
      error.message
    );
  }
};
postgresConnect();

// =================== Create server with HTTP module ==================

const server = createServer(app);

// =================== Start server with HTTP module ===================

server.listen(PORT, HOST, () =>
  console.log(`Server running at http://${HOST}:${PORT}/api`)
);

console.log(
  '================== Server is started successfully! =================='
);
