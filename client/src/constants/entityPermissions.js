const ENTITY_PERMISSIONS = {
  establishments: {
    edit: 'EDIT_ESTABLISHMENTS',
    remove: 'REMOVE_ESTABLISHMENTS',
  },
  products: {
    edit: 'EDIT_PRODUCTS',
    remove: 'REMOVE_PRODUCTS',
  },
  categories: {
    edit: 'EDIT_CATEGORIES',
    remove: 'REMOVE_CATEGORIES',
  },
  moderation: {
    category: 'MODERATION_CATEGORIES',
    product: 'MODERATION_PRODUCTS',
    establishment: 'MODERATION_ESTABLISHMENTS',
  },
  currencies: {
    edit: 'EDIT_CURRENCIES',
    remove: 'REMOVE_CURRENCIES',
  },
  measures: {
    edit: 'EDIT_MEASURES',
    remove: 'REMOVE_MEASURES',
  },
  users: {
    edit: 'EDIT_USERS',
    remove: 'REMOVE_USERS',
  },
  roles: {
    edit: 'EDIT_ROLES',
    remove: 'REMOVE_ROLES',
    assign: 'ASSIGN_ROLES',
  },
  expenses: {
    manage: 'MANAGE_EXPENSES',
  },
};

export { ENTITY_PERMISSIONS };
