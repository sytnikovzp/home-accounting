const { createServer } = require('http');

const app = require('./src/app');
const {
  configs: {
    SERVER: { HOST, PORT },
    DATABASE: { DB_NAME },
  },
} = require('./src/constants');
const { connectMongoDB } = require('./src/db/dbMongo');
const dbPostgres = require('./src/db/dbPostgres/models');

const connectPostgresDB = async () => {
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

// ========================= DATABASE CONNECT ==========================
const connectDatabases = async () => {
  try {
    await connectMongoDB();
    await connectPostgresDB();
  } catch (error) {
    console.error('Error connecting to databases:', error.message);
    process.exit(1);
  }
};

// ===================== Create and Start Server =======================
const startServer = async () => {
  await connectDatabases();

  const server = createServer(app);

  server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/api`);
  });
};
console.log(
  '================== Server is started successfully! =================='
);
startServer();
