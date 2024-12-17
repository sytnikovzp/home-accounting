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
  fetchAllUsers: async (page = 1, limit = 6, sort = 'uuid', order = 'asc') => {
    const { data, totalCount } = await userService.getAllUsers(
      page,
      limit,
      sort,
      order
    );
    return {
      data,
      totalCount,
    };
  },
  fetchUserProfile: () => userService.getUserProfile(),
  fetchUserByUuid: (userUuid) => userService.getUserByUuid(userUuid),
  editUser: (userUuid, fullName, password, role) =>
    userService.updateUser(userUuid, fullName, password, role),
  uploadUserPhoto: (userUuid, userPhoto) =>
    userService.updateUserPhoto(userUuid, userPhoto),
  removeUserPhoto: (userUuid) => userService.removeUserPhoto(userUuid),
  removeUser: (userUuid) => userService.deleteUser(userUuid),

  // Role and Permission management
  fetchAllPermissions: async (
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc'
  ) => {
    const { data, totalCount } = await roleService.getAllPermissions(
      page,
      limit,
      sort,
      order
    );
    return {
      data,
      totalCount,
    };
  },
  fetchAllRoles: async (page = 1, limit = 6, sort = 'uuid', order = 'asc') => {
    const { data, totalCount } = await roleService.getAllRoles(
      page,
      limit,
      sort,
      order
    );
    return {
      data,
      totalCount,
    };
  },
  fetchRoleByUuid: (roleUuid) => roleService.getRoleByUuid(roleUuid),
  createRole: (roleData) => roleService.createRole(roleData),
  editRole: (roleUuid, roleData) => roleService.updateRole(roleUuid, roleData),
  removeRole: (roleUuid) => roleService.deleteRole(roleUuid),

  // Category management
  fetchAllCategories: async (
    status = 'approved',
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc'
  ) => {
    const { data, totalCount } = await categoryService.getAllCategories(
      status,
      page,
      limit,
      sort,
      order
    );
    return {
      data,
      totalCount,
    };
  },
  fetchCategoryByUuid: (categoryUuid) =>
    categoryService.getCategoryByUuid(categoryUuid),
  addCategory: (title) => categoryService.createCategory(title),
  editCategory: (categoryUuid, title) =>
    categoryService.updateCategory(categoryUuid, title),
  moderationCategory: (categoryUuid, status) =>
    categoryService.moderationCategory(categoryUuid, status),
  removeCategory: (categoryUuid) =>
    categoryService.deleteCategory(categoryUuid),

  // Currency rates
  fetchFilteredRates: async () => {
    const allRates = await currencyService.getNBURates();
    return allRates.filter(({ cc }) => CURRENCY_CODES.includes(cc));
  },

  // Currency management
  fetchAllCurrencies: async (
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc'
  ) => {
    const { data, totalCount } = await currencyService.getAllCurrencies(
      page,
      limit,
      sort,
      order
    );
    return {
      data,
      totalCount,
    };
  },
  fetchCurrencyByUuid: (currencyUuid) =>
    currencyService.getCurrencyByUuid(currencyUuid),
  addCurrency: (title, code) => currencyService.createCurrency(title, code),
  editCurrency: (currencyUuid, title, code) =>
    currencyService.updateCurrency(currencyUuid, title, code),
  removeCurrency: (currencyUuid) =>
    currencyService.deleteCurrency(currencyUuid),

  // Measure management
  fetchAllMeasures: async (
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc'
  ) => {
    const { data, totalCount } = await measureService.getAllMeasures(
      page,
      limit,
      sort,
      order
    );
    return {
      data,
      totalCount,
    };
  },
  fetchMeasureByUuid: (measureUuid) =>
    measureService.getMeasureByUuid(measureUuid),
  addMeasure: (title, description = '') =>
    measureService.createMeasure(title, description),
  editMeasure: (measureUuid, title, description) =>
    measureService.updateMeasure(measureUuid, title, description),
  removeMeasure: (measureUuid) => measureService.deleteMeasure(measureUuid),

  // Product management
  fetchAllProducts: async (
    status = 'approved',
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc'
  ) => {
    const { data, totalCount } = await productService.getAllProducts(
      status,
      page,
      limit,
      sort,
      order
    );
    return {
      data,
      totalCount,
    };
  },
  fetchProductByUuid: (productUuid) =>
    productService.getProductByUuid(productUuid),
  addProduct: (title, category = '') =>
    productService.createProduct(title, category),
  editProduct: (productUuid, title, category) =>
    productService.updateProduct(productUuid, title, category),
  moderationProduct: (productUuid, status) =>
    productService.moderationProduct(productUuid, status),
  removeProduct: (productUuid) => productService.deleteProduct(productUuid),

  // Purchase management
  fetchAllPurchases: async (
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc'
  ) => {
    const { data, totalCount } = await purchaseService.getAllPurchases(
      page,
      limit,
      sort,
      order
    );
    return {
      data,
      totalCount,
    };
  },
  fetchPurchaseByUuid: (purchaseUuid) =>
    purchaseService.getPurchaseByUuid(purchaseUuid),
  addPurchase: (product, quantity, unitPrice, shop, measure, currency, date) =>
    purchaseService.createPurchase(
      product,
      quantity,
      unitPrice,
      shop,
      measure,
      currency,
      date
    ),
  editPurchase: (
    purchaseUuid,
    product,
    quantity,
    unitPrice,
    shop,
    measure,
    currency,
    date
  ) =>
    purchaseService.updatePurchase(
      purchaseUuid,
      product,
      quantity,
      unitPrice,
      shop,
      measure,
      currency,
      date
    ),
  removePurchase: (purchaseUuid) =>
    purchaseService.deletePurchase(purchaseUuid),

  // Shop management
  fetchAllShops: async (
    status = 'approved',
    page = 1,
    limit = 6,
    sort = 'uuid',
    order = 'asc'
  ) => {
    const { data, totalCount } = await shopService.getAllShops(
      status,
      page,
      limit,
      sort,
      order
    );
    return {
      data,
      totalCount,
    };
  },
  fetchShopByUuid: (shopUuid) => shopService.getShopByUuid(shopUuid),
  addShop: (title, description = '', url = '') =>
    shopService.createShop(title, description, url),
  editShop: (shopUuid, title, description, url) =>
    shopService.updateShop(shopUuid, title, description, url),
  uploadShopLogo: (shopUuid, shopLogo) =>
    shopService.updateShopLogo(shopUuid, shopLogo),
  removeShopLogo: (shopUuid) => shopService.removeShopLogo(shopUuid),
  moderationShop: (shopUuid, status) =>
    shopService.moderationShop(shopUuid, status),
  removeShop: (shopUuid) => shopService.deleteShop(shopUuid),

  // Statistics
  fetchCostByCategoryPerPeriod: async (category, ago = null) => {
    const data = await statisticService.getCostByCategoryPerPeriod(
      category,
      ago
    );
    return data;
  },
  fetchCostByShopPerPeriod: async (shop, ago = null) => {
    const data = await statisticService.getCostByShopPerPeriod(shop, ago);
    return data;
  },
  fetchCostByCategories: async (ago = null) => {
    const data = await statisticService.getCostByCategories(ago);
    return data;
  },
  fetchCostByShops: async (ago = null) => {
    const data = await statisticService.getCostByShops(ago);
    return data;
  },
};

export default restController;
