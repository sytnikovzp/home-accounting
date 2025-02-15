const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const basename = path.basename(__filename);

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
