import { CURRENCY_CODES } from '../../constants';
import { authService, userService, currencyService } from '../../services';

const restController = {
  // Authentication
  registration: (fullName, email, password) =>
    authService.registration(fullName, email, password),
  login: (email, password) => authService.login(email, password),
  logout: () => authService.logout(),
  refreshAccessToken: (originalRequest) =>
    authService.refreshAccessToken(originalRequest),

  // User management
  fetchUserProfile: () => userService.getUserProfile(),

  // Currency rates
  fetchFilteredRates: async () => {
    const allRates = await currencyService.getNBURates();
    return allRates.filter(({ cc }) => CURRENCY_CODES.includes(cc));
  },

  // Currency management
  fetchAllCurrencies: () => currencyService.getAllCurrencies(),
  fetchCurrencyById: (currencyId) =>
    currencyService.getCurrencyById(currencyId),
  addCurrency: (title, description) =>
    currencyService.createCurrency(title, description),
  editCurrency: (currencyId, title, description) =>
    currencyService.updateCurrency(currencyId, title, description),
  removeCurrency: (currencyId) => currencyService.deleteCurrency(currencyId),
};

export default restController;
