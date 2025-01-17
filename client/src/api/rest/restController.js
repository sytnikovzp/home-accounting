import {
  forgotPassword,
  login,
  logout,
  refreshAccessToken,
  registration,
  resendVerifyEmail,
  resetPassword,
} from '../../services/authService';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByUuid,
  updateCategory,
} from '../../services/categoriesService';
import {
  createCurrency,
  deleteCurrency,
  getAllCurrencies,
  getCurrencyByUuid,
  updateCurrency,
} from '../../services/currenciesService';
import {
  createEstablishment,
  deleteEstablishment,
  deleteEstablishmentLogo,
  getAllEstablishments,
  getEstablishmentByUuid,
  updateEstablishment,
  updateEstablishmentLogo,
} from '../../services/establishmentsService';
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseByUuid,
  updateExpense,
} from '../../services/expensesService';
import {
  createMeasure,
  deleteMeasure,
  getAllMeasures,
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
  getAllProducts,
  getProductByUuid,
  updateProduct,
} from '../../services/productsService';
import {
  createRole,
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getRoleByUuid,
  updateRole,
} from '../../services/rolesService';
import {
  changePassword,
  deleteUser,
  deleteUserPhoto,
  getAllUsers,
  getUserByUuid,
  getUserProfile,
  updateUser,
  updateUserPhoto,
} from '../../services/usersService';

const restController = {
  // Authentication
  registration: (fullName, email, password) =>
    registration(fullName, email, password),
  login: (email, password) => login(email, password),
  logout: () => logout(),
  refreshAccessToken: (originalRequest) => refreshAccessToken(originalRequest),
  resendVerifyEmail: (email) => resendVerifyEmail(email),
  forgotPassword: (email) => forgotPassword(email),
  resetPassword: (token, newPassword, confirmNewPassword) =>
    resetPassword(token, newPassword, confirmNewPassword),

  // User management
  fetchAllUsers: async ({
    emailVerificationStatus = 'all',
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc',
  } = {}) => {
    const { data, totalCount } = await getAllUsers({
      emailVerificationStatus,
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
  fetchUserProfile: () => getUserProfile(),
  fetchUserByUuid: (userUuid) => getUserByUuid(userUuid),
  editUser: (userUuid, fullName, email, role) =>
    updateUser(userUuid, fullName, email, role),
  changePassword: (userUuid, newPassword, confirmNewPassword) =>
    changePassword(userUuid, newPassword, confirmNewPassword),
  uploadUserPhoto: (userUuid, userPhoto) =>
    updateUserPhoto(userUuid, userPhoto),
  deleteUserPhoto: (userUuid) => deleteUserPhoto(userUuid),
  removeUser: (userUuid) => deleteUser(userUuid),

  // Role and Permission management
  fetchAllPermissions: async () => {
    const { data } = await getAllPermissions({});
    return { data };
  },
  fetchAllRoles: async ({
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc',
  } = {}) => {
    const { data, totalCount } = await getAllRoles({
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
  fetchRoleByUuid: (roleUuid) => getRoleByUuid(roleUuid),
  addRole: (title, description, permissions) =>
    createRole(title, description, permissions),
  editRole: (roleUuid, title, description, permissions) =>
    updateRole(roleUuid, title, description, permissions),
  removeRole: (roleUuid) => deleteRole(roleUuid),

  // Category management
  fetchAllCategories: async ({
    status = 'approved',
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc',
  } = {}) => {
    const { data, totalCount } = await getAllCategories({
      status,
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
  fetchCategoryByUuid: (categoryUuid) => getCategoryByUuid(categoryUuid),
  addCategory: (title) => createCategory(title),
  editCategory: (categoryUuid, title) => updateCategory(categoryUuid, title),
  removeCategory: (categoryUuid) => deleteCategory(categoryUuid),

  // Currency management
  fetchAllCurrencies: async ({
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc',
  } = {}) => {
    const { data, totalCount } = await getAllCurrencies({
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
  fetchCurrencyByUuid: (currencyUuid) => getCurrencyByUuid(currencyUuid),
  addCurrency: (title, code) => createCurrency(title, code),
  editCurrency: (currencyUuid, title, code) =>
    updateCurrency(currencyUuid, title, code),
  removeCurrency: (currencyUuid) => deleteCurrency(currencyUuid),

  // Measure management
  fetchAllMeasures: async ({
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc',
  } = {}) => {
    const { data, totalCount } = await getAllMeasures({
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
  fetchMeasureByUuid: (measureUuid) => getMeasureByUuid(measureUuid),
  addMeasure: (title, description = '') => createMeasure(title, description),
  editMeasure: (measureUuid, title, description) =>
    updateMeasure(measureUuid, title, description),
  removeMeasure: (measureUuid) => deleteMeasure(measureUuid),

  // Product management
  fetchAllProducts: async ({
    status = 'approved',
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc',
  } = {}) => {
    const { data, totalCount } = await getAllProducts({
      status,
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
  fetchProductByUuid: (productUuid) => getProductByUuid(productUuid),
  addProduct: (title, category = '') => createProduct(title, category),
  editProduct: (productUuid, title, category) =>
    updateProduct(productUuid, title, category),
  removeProduct: (productUuid) => deleteProduct(productUuid),

  // Expense management
  fetchAllExpenses: async ({
    ago = 'allTime',
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc',
  } = {}) => {
    const { data, totalCount } = await getAllExpenses({
      ago,
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
  fetchAllEstablishments: async ({
    status = 'approved',
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc',
  } = {}) => {
    const { data, totalCount } = await getAllEstablishments({
      status,
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
  fetchEstablishmentByUuid: (establishmentUuid) =>
    getEstablishmentByUuid(establishmentUuid),
  addEstablishment: (title, description = '', url = '') =>
    createEstablishment(title, description, url),
  editEstablishment: (establishmentUuid, title, description, url) =>
    updateEstablishment(establishmentUuid, title, description, url),
  uploadEstablishmentLogo: (establishmentUuid, establishmentLogo) =>
    updateEstablishmentLogo(establishmentUuid, establishmentLogo),
  deleteEstablishmentLogo: (establishmentUuid) =>
    deleteEstablishmentLogo(establishmentUuid),
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
