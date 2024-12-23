const { sequelize } = require('../db/dbPostgres/models');

module.exports.syncModel = async (model) => {
  try {
    await model.sync({ alter: true });
    console.log('===========================================');
    console.log(`Sync of ${model.name} has been done successfully!`);
  } catch (error) {
    console.error('===========================================');
    console.error(`Can't sync ${model.name}: `, error.message);
  }
};

module.exports.syncAllModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('===========================================');
    console.log('Sync all models has been done successfully!');
  } catch (error) {
    console.error('===========================================');
    console.error('Can not sync all models: ', error.message);
  }
};
