import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminPanelSettings,
  ListAlt,
  Logout,
  Password,
  Portrait,
} from '@mui/icons-material';

import useAuthUser from '../../../hooks/useAuthUser';
import { useLogoutMutation } from '../../../store/services';

import UserMenuItem from './UserMenuItem';

const menuItems = [
  {
    action: () => `/profile`,
    icon: <Portrait fontSize='small' />,
    label: 'Переглянути профіль',
  },
  {
    action: () => `/edit-profile`,
    icon: <ListAlt fontSize='small' />,
    label: 'Редагувати профіль',
  },
  {
    action: () => `/permissions`,
    icon: <AdminPanelSettings fontSize='small' />,
    label: 'Переглянути дозволи',
  },
  {
    action: () => `/password`,
    icon: <Password fontSize='small' />,
    label: 'Змінити пароль',
  },
  {
    action: 'handleLogout',
    icon: <Logout fontSize='small' />,
    isLogout: true,
    label: 'Вийти',
  },
];

function UserMenu({ closeUserMenu }) {
  const [logoutMutation] = useLogoutMutation();

  const { authenticatedUser } = useAuthUser();

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
