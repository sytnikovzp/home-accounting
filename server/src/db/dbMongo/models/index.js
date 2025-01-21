const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const env = process.env.NODE_ENV || 'development';
const basename = path.basename(__filename);
const configPath = path.resolve('src', 'config', 'mongoConfig.js');
const config = require(configPath)[env];

mongoose
  .connect(`mongodb://${config.host}:${config.port}/${config.dbName}`)
  .then(() =>
    console.log(
      `Connection to MongoDB database <<< ${config.dbName} >>> is done!`
    )
  )
  .catch((error) => console.error(error.message));

const dbMongo = {};

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
  )
  .forEach((file) => {
    const model = require(path.resolve(__dirname, file));
    dbMongo[model.modelName] = model;
  });

dbMongo.mongoose = mongoose;

module.exports = dbMongo;
