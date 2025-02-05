import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLogoutMutation } from '../../../store/services';

import UserMenuItem from './UserMenuItem';

function UserMenu({ closeUserMenu, authenticatedUser, menuItems }) {
  const [logoutMutation] = useLogoutMutation();

  const navigate = useNavigate();

  const navigateTo = useCallback((path) => navigate(path), [navigate]);

  const handleMenuItemClick = useCallback(
    async (action, isLogout) => {
      if (isLogout) {
        await logoutMutation();
        navigateTo('/');
      } else if (typeof action === 'function') {
        navigateTo(action(authenticatedUser));
      } else {
        navigateTo(authenticatedUser[action]);
      }
      closeUserMenu();
    },
    [closeUserMenu, logoutMutation, navigateTo, authenticatedUser]
  );

  return (
    <>
      {menuItems.map((item, index) => (
        <UserMenuItem key={index} {...item} onAction={handleMenuItemClick} />
      ))}
    </>
  );
}

export default UserMenu;
