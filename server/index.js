const http = require('http');
// =====================================
require('dotenv').config();
// =====================================
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const HOST = process.env.HOST;

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`Server is started on http://${HOST}:${PORT}`);
});

console.log('Server is started!');
