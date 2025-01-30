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
import {
  createRole,
  deleteRole,
  getRoleByUuid,
  updateRole,
} from '../../services/rolesService';

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

  // Role management
  fetchRoleByUuid: (roleUuid) => getRoleByUuid(roleUuid),
  addRole: (title, description, permissions) =>
    createRole(title, description, permissions),
  editRole: (roleUuid, title, description, permissions) =>
    updateRole(roleUuid, title, description, permissions),
  removeRole: (roleUuid) => deleteRole(roleUuid),

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
