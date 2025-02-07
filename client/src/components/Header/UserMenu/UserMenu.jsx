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
  const { authenticatedUser } = useAuthUser();
  const navigate = useNavigate();

  const [logoutMutation] = useLogoutMutation();

  const handleNavigateTo = useCallback((path) => navigate(path), [navigate]);

  const handleMenuItemClick = useCallback(
    async (action, isLogout) => {
      if (isLogout) {
        await logoutMutation();
        handleNavigateTo('/');
      } else if (typeof action === 'function') {
        handleNavigateTo(action(authenticatedUser));
      } else {
        handleNavigateTo(authenticatedUser[action]);
      }
      closeUserMenu();
    },
    [closeUserMenu, logoutMutation, handleNavigateTo, authenticatedUser]
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
