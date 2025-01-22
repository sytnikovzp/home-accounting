import { resetPassword } from '../../services/authService';
import {
  createCategory,
  deleteCategory,
  getCategoryByUuid,
  updateCategory,
} from '../../services/categoriesService';
import {
  createCurrency,
  deleteCurrency,
  getCurrencyByUuid,
  updateCurrency,
} from '../../services/currenciesService';
import {
  createEstablishment,
  deleteEstablishment,
  getEstablishmentByUuid,
  resetEstablishmentLogo,
  updateEstablishment,
  updateEstablishmentLogo,
} from '../../services/establishmentsService';
import {
  createExpense,
  deleteExpense,
  getExpenseByUuid,
  updateExpense,
} from '../../services/expensesService';
import {
  createMeasure,
  deleteMeasure,
  getMeasureByUuid,
  updateMeasure,
} from '../../services/measuresService';
import {
  getAllPendingItems,
  moderationCategory,
  moderationEstablishment,
  moderationProduct,
} from '../../services/moderationsService';
import {
  createProduct,
  deleteProduct,
  getProductByUuid,
  updateProduct,
} from '../../services/productsService';
import {
  createRole,
  deleteRole,
  getRoleByUuid,
  updateRole,
} from '../../services/rolesService';
import {
  changePassword,
  deleteUser,
  resetUserPhoto,
  updateUser,
  updateUserPhoto,
} from '../../services/usersService';

const restController = {
  // Authentication
  // registration: (fullName, email, password) =>
  //   registration(fullName, email, password),
  // login: (email, password) => login(email, password),
  // logout: () => logout(),
  // refreshAccessToken: (originalRequest) => refreshAccessToken(originalRequest),
  // forgotPassword: (email) => forgotPassword(email),
  resetPassword: (token, newPassword, confirmNewPassword) =>
    resetPassword(token, newPassword, confirmNewPassword),

  // User management
  editUser: (userUuid, fullName, email, role) =>
    updateUser(userUuid, fullName, email, role),
  changePassword: (userUuid, newPassword, confirmNewPassword) =>
    changePassword(userUuid, newPassword, confirmNewPassword),
  uploadUserPhoto: (userUuid, userPhoto) =>
    updateUserPhoto(userUuid, userPhoto),
  resetUserPhoto: (userUuid) => resetUserPhoto(userUuid),
  removeUser: (userUuid) => deleteUser(userUuid),

  // Role management
  fetchRoleByUuid: (roleUuid) => getRoleByUuid(roleUuid),
  addRole: (title, description, permissions) =>
    createRole(title, description, permissions),
  editRole: (roleUuid, title, description, permissions) =>
    updateRole(roleUuid, title, description, permissions),
  removeRole: (roleUuid) => deleteRole(roleUuid),

  // Category management
  fetchCategoryByUuid: (categoryUuid) => getCategoryByUuid(categoryUuid),
  addCategory: (title) => createCategory(title),
  editCategory: (categoryUuid, title) => updateCategory(categoryUuid, title),
  removeCategory: (categoryUuid) => deleteCategory(categoryUuid),

  // Currency management
  fetchCurrencyByUuid: (currencyUuid) => getCurrencyByUuid(currencyUuid),
  addCurrency: (title, code) => createCurrency(title, code),
  editCurrency: (currencyUuid, title, code) =>
    updateCurrency(currencyUuid, title, code),
  removeCurrency: (currencyUuid) => deleteCurrency(currencyUuid),

  // Measure management
  fetchMeasureByUuid: (measureUuid) => getMeasureByUuid(measureUuid),
  addMeasure: (title, description = '') => createMeasure(title, description),
  editMeasure: (measureUuid, title, description) =>
    updateMeasure(measureUuid, title, description),
  removeMeasure: (measureUuid) => deleteMeasure(measureUuid),

  // Product management
  fetchProductByUuid: (productUuid) => getProductByUuid(productUuid),
  addProduct: (title, category = '') => createProduct(title, category),
  editProduct: (productUuid, title, category) =>
    updateProduct(productUuid, title, category),
  removeProduct: (productUuid) => deleteProduct(productUuid),

  // Expense management
  fetchExpenseByUuid: (expenseUuid) => getExpenseByUuid(expenseUuid),
  addExpense: (
    product,
    quantity,
    unitPrice,
    establishment,
    measure,
    currency,
    date
  ) =>
    createExpense(
      product,
      quantity,
      unitPrice,
      establishment,
      measure,
      currency,
      date
    ),
  editExpense: (
    expenseUuid,
    product,
    quantity,
    unitPrice,
    establishment,
    measure,
    currency,
    date
  ) =>
    updateExpense(
      expenseUuid,
      product,
      quantity,
      unitPrice,
      establishment,
      measure,
      currency,
      date
    ),
  removeExpense: (expenseUuid) => deleteExpense(expenseUuid),

  // Establishment management
  fetchEstablishmentByUuid: (establishmentUuid) =>
    getEstablishmentByUuid(establishmentUuid),
  addEstablishment: (title, description = '', url = '') =>
    createEstablishment(title, description, url),
  editEstablishment: (establishmentUuid, title, description, url) =>
    updateEstablishment(establishmentUuid, title, description, url),
  changeLogo: (establishmentUuid, establishmentLogo) =>
    updateEstablishmentLogo(establishmentUuid, establishmentLogo),
  resetEstablishmentLogo: (establishmentUuid) =>
    resetEstablishmentLogo(establishmentUuid),
  removeEstablishment: (establishmentUuid) =>
    deleteEstablishment(establishmentUuid),

  // Moderation
  fetchAllPendingItems: async ({
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc',
  } = {}) => {
    const { data, totalCount } = await getAllPendingItems({
      page,
      limit,
      sort,
      order,
    });
    return {
      data,
      totalCount,
    };
  },
  moderationCategory: (categoryUuid, status) =>
    moderationCategory(categoryUuid, status),
  moderationProduct: (productUuid, status) =>
    moderationProduct(productUuid, status),
  moderationEstablishment: (establishmentUuid, status) =>
    moderationEstablishment(establishmentUuid, status),
};

export default restController;
