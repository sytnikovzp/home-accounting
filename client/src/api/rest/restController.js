import {
  forgotPassword,
  login,
  logout,
  refreshAccessToken,
  registration,
  resetPassword,
} from '../../services/authService';
import {
  getAllPendingItems,
  moderationCategory,
  moderationEstablishment,
  moderationProduct,
} from '../../services/moderationService';

const restController = {
  // Authentication
  registration: (fullName, email, password) =>
    registration(fullName, email, password),
  login: (email, password) => login(email, password),
  logout: () => logout(),
  refreshAccessToken: (originalRequest) => refreshAccessToken(originalRequest),
  forgotPassword: (email) => forgotPassword(email),
  resetPassword: (token, newPassword, confirmNewPassword) =>
    resetPassword(token, newPassword, confirmNewPassword),

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
