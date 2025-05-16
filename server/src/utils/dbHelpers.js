const { User } = require('../db/dbMongo/models');

const { notFound } = require('../errors/generalErrors');

const getRecordByTitle = async function (Model, title) {
  if (!title) {
    return null;
  }
  const record = await Model.findOne({
    attributes: ['uuid', 'title'],
    raw: true,
    where: { title },
  });
  if (!record) {
    throw notFound(`${Model.name} не знайдено`);
  }
  return record;
};

const getCurrencyByTitle = async function (Model, title) {
  if (!title) {
    return null;
  }
  const record = await Model.findOne({
    attributes: ['uuid', 'title', 'code'],
    raw: true,
    where: { title },
  });
  if (!record) {
    throw notFound(`${Model.name} не знайдено`);
  }
  return record;
};

const getUserDetailsByEmail = async function (email) {
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return null;
  }
  return {
    fullName: foundUser.fullName,
    uuid: foundUser.uuid,
  };
};

module.exports = {
  getRecordByTitle,
  getCurrencyByTitle,
  getUserDetailsByEmail,
};
