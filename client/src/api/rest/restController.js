import { CURRENCY_CODES } from '../../constants';
import {
  authService,
  userService,
  roleService,
  categoryService,
  currencyService,
  measureService,
  productService,
  purchaseService,
  shopService,
  statisticService,
} from '../../services';

const restController = {
  // Authentication
  registration: (fullName, email, password) =>
    authService.registration(fullName, email, password),
  login: (email, password) => authService.login(email, password),
  logout: () => authService.logout(),
  refreshAccessToken: (originalRequest) =>
    authService.refreshAccessToken(originalRequest),

  // User management
  fetchAllUsers: async ({ page = 1, limit = 6 } = {}) => {
    const { data, total } = await userService.getAllUsers({ page, limit });
    return {
      users: data,
      totalCount: total,
    };
  },
  fetchUserProfile: () => userService.getUserProfile(),
  fetchUserById: (userId) => userService.getUserById(userId),
  editUser: (userId, { fullName, password, role }) =>
    userService.updateUser(userId, { fullName, password, role }),
  uploadUserPhoto: (userId, userPhoto) =>
    userService.updateUserPhoto(userId, userPhoto),
  removeUserPhoto: (userId) => userService.removeUserPhoto(userId),
  removeUser: (userId) => userService.deleteUser(userId),

  // Role and Permission management
  fetchAllPermissions: async ({ page = 1, limit = 6 } = {}) => {
    const { data, total } = await roleService.getAllPermissions({
      page,
      limit,
    });
    return {
      permissions: data,
      totalCount: total,
    };
  },
  fetchAllRoles: async () => {
    const roles = await roleService.getAllRoles();
    return roles;
  },
  fetchRoleById: (roleId) => roleService.getRoleById(roleId),
  createRole: (roleData) => roleService.createRole(roleData),
  editRole: (roleId, roleData) => roleService.updateRole(roleId, roleData),
  removeRole: (roleId) => roleService.deleteRole(roleId),

  // Category management
  fetchAllCategories: async ({
    status = 'approved',
    page = 1,
    limit = 6,
  } = {}) => {
    const { data, totalCount } = await categoryService.getAllCategories({
      status,
      page,
      limit,
    });
    return {
      data,
      totalCount,
    };
  },
  fetchCategoryById: (categoryId) =>
    categoryService.getCategoryById(categoryId),
  addCategory: (title) => categoryService.createCategory(title),
  editCategory: (categoryId, title) =>
    categoryService.updateCategory(categoryId, title),
  reviewCategory: (categoryId, status) =>
    categoryService.reviewCategory(categoryId, status),
  removeCategory: (categoryId) => categoryService.deleteCategory(categoryId),

  // Currency rates
  fetchFilteredRates: async () => {
    const allRates = await currencyService.getNBURates();
    return allRates.filter(({ cc }) => CURRENCY_CODES.includes(cc));
  },

  // Currency management
  fetchAllCurrencies: async ({ page = 1, limit = 6 } = {}) => {
    const { data, totalCount } = await currencyService.getAllCurrencies({
      page,
      limit,
    });
    return {
      data,
      totalCount,
    };
  },
  fetchCurrencyById: (currencyId) =>
    currencyService.getCurrencyById(currencyId),
  addCurrency: (title, description) =>
    currencyService.createCurrency(title, description),
  editCurrency: (currencyId, title, description) =>
    currencyService.updateCurrency(currencyId, title, description),
  removeCurrency: (currencyId) => currencyService.deleteCurrency(currencyId),

  // Measure management
  fetchAllMeasures: async ({ page = 1, limit = 6 } = {}) => {
    const { data, totalCount } = await measureService.getAllMeasures({
      page,
      limit,
    });
    return {
      data,
      totalCount,
    };
  },
  fetchMeasureById: (measureId) => measureService.getMeasureById(measureId),
  addMeasure: (title, description = '') =>
    measureService.createMeasure(title, description),
  editMeasure: (measureId, title, description) =>
    measureService.updateMeasure(measureId, title, description),
  removeMeasure: (measureId) => measureService.deleteMeasure(measureId),

  // Product management
  fetchAllProducts: async ({
    status = 'approved',
    page = 1,
    limit = 6,
  } = {}) => {
    const { data, totalCount } = await productService.getAllProducts({
      status,
      page,
      limit,
    });
    return {
      data,
      totalCount,
    };
  },
  fetchProductById: (productId) => productService.getProductById(productId),
  addProduct: (title, category = '') =>
    productService.createProduct(title, category),
  editProduct: (productId, { title, category }) =>
    productService.updateProduct(productId, { title, category }),
  reviewProduct: (productId, status) =>
    productService.reviewProduct(productId, status),
  removeProduct: (productId) => productService.deleteProduct(productId),

  // Purchase management
  fetchAllPurchases: async ({ page = 1, limit = 6 } = {}) => {
    const { data, total } = await purchaseService.getAllPurchases({
      page,
      limit,
    });
    return {
      purchases: data,
      totalCount: total,
    };
  },
  fetchPurchaseById: (purchaseId) =>
    purchaseService.getPurchaseById(purchaseId),
  addPurchase: ({ product, amount, price, shop, measure, currency }) =>
    purchaseService.createPurchase({
      product,
      amount,
      price,
      shop,
      measure,
      currency,
    }),
  editPurchase: (
    purchaseId,
    { product, amount, price, shop, measure, currency }
  ) =>
    purchaseService.updatePurchase(purchaseId, {
      product,
      amount,
      price,
      shop,
      measure,
      currency,
    }),
  removePurchase: (purchaseId) => purchaseService.deletePurchase(purchaseId),

  // Shop management
  fetchAllShops: async ({ status = 'approved', page = 1, limit = 6 } = {}) => {
    const { data, totalCount } = await shopService.getAllShops({
      status,
      page,
      limit,
    });
    return {
      data,
      totalCount,
    };
  },
  fetchShopById: (shopId) => shopService.getShopById(shopId),
  addShop: ({ title, description = '', url = '' }) =>
    shopService.createShop({ title, description, url }),
  editShop: (shopId, { title, description, url }) =>
    shopService.updateShop(shopId, { title, description, url }),
  uploadShopLogo: (shopId, shopLogo) =>
    shopService.updateShopLogo(shopId, shopLogo),
  removeShopLogo: (shopId) => shopService.removeShopLogo(shopId),
  reviewShop: (shopId, status) => shopService.reviewShop(shopId, status),
  removeShop: (shopId) => shopService.deleteShop(shopId),

  // Statistics
  fetchCostByCategoryPerPeriod: async ({ category, ago = null }) => {
    const data = await statisticService.getCostByCategoryPerPeriod({
      category,
      ago,
    });
    return data;
  },
  fetchCostByShopPerPeriod: async ({ shop, ago = null }) => {
    const data = await statisticService.getCostByShopPerPeriod({ shop, ago });
    return data;
  },
  fetchCostByCategories: async ({ ago = null } = {}) => {
    const data = await statisticService.getCostByCategories({ ago });
    return data;
  },
  fetchCostByShops: async ({ ago = null } = {}) => {
    const data = await statisticService.getCostByShops({ ago });
    return data;
  },
};

export default restController;
