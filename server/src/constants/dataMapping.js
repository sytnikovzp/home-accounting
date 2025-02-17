const STATUS_MODERATION_MAPPING = {
  approved: 'Затверджено',
  pending: 'Очікує модерації',
  rejected: 'Відхилено',
};

const EMAIL_CONFIRMATION_MAPPING = {
  pending: 'Очікує підтвердження',
  confirmed: 'Підтверджений',
};

module.exports = {
  STATUS_MODERATION_MAPPING,
  EMAIL_CONFIRMATION_MAPPING,
};
