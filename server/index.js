const http = require('http');
// =====================================
require('dotenv').config();
// =====================================
const app = require('./src/app');
const db = require('./src/db/models');

const PORT = process.env.PORT || 5000;

const HOST = process.env.HOST;

const server = http.createServer(app);

const dbCheck = async () => {
  try {
    await db.sequelize.authenticate();
    console.log(`Connection to DB <<<${process.env.DB_NAME}>>> has been done!`);
  } catch (error) {
    console.log(
      `Can not connect to DB ${process.env.DB_NAME}: `,
      error.message
    );
  }
};

dbCheck();

server.listen(PORT, HOST, () => {
  console.log(`Server is started on http://${HOST}:${PORT}`);
});

console.log('Server is started!');
