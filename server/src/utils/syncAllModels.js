const { sequelize } = require('../db/dbPostgres/models');

const syncAllModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('==========================================================');
    console.log('Synchronization of ALL models completed successfully!');
  } catch (error) {
    console.error('==========================================================');
    console.error('Can`t sync ALL models: ', error.message);
  }
};

(async () => {
  await syncAllModels();
  process.exit(1);
})();
