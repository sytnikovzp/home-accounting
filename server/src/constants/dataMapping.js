const statusModerationMapping = {
  approved: 'Затверджено',
  pending: 'Очікує модерації',
  rejected: 'Відхилено',
};

const titleRolesMapping = {
  User: 'Користувач',
  Moderator: 'Модератор',
  Administrator: 'Адміністратор',
};

const roleTitleMapping = {
  Користувач: 'User',
  Модератор: 'Moderator',
  Адміністратор: 'Administrator',
};

module.exports = {
  statusModerationMapping,
  titleRolesMapping,
  roleTitleMapping,
};
