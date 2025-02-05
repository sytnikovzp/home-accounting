import { Avatar, Box, IconButton, Menu, Tooltip } from '@mui/material';
import {
  AdminPanelSettings,
  ListAlt,
  Logout,
  Password,
  Portrait,
} from '@mui/icons-material';

import { configs } from '../../constants';
import { stringAvatar } from '../../utils/sharedFunctions';

import UserMenu from './UserMenu/UserMenu';
import WelcomeBlock from './WelcomeBlock';

import { stylesAuthenticatedMenu } from '../../styles';

const menuItemsData = [
  {
    action: (user) => `/users/${user.uuid}`,
    icon: <Portrait fontSize='small' />,
    label: 'Переглянути профіль',
  },
  {
    action: (user) => `/users/edit/${user.uuid}`,
    icon: <ListAlt fontSize='small' />,
    label: 'Редагувати профіль',
  },
  {
    action: (user) => `/roles/${user.role.uuid}`,
    icon: <AdminPanelSettings fontSize='small' />,
    label: 'Переглянути права',
  },
  {
    action: (user) => `/users/password/${user.uuid}`,
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

const { BASE_URL } = configs;

function AuthenticatedMenu({
  closeUserMenu,
  authenticatedUser,
  openUserMenu,
  toggleUserMenu,
}) {
  return (
    <Box sx={{ alignItems: 'center', display: 'flex' }}>
      <WelcomeBlock authenticatedUser={authenticatedUser} />
      <Tooltip title='Обліковий запис'>
        <IconButton
          aria-controls={openUserMenu ? 'account-menu' : null}
          aria-expanded={openUserMenu ? 'true' : null}
          aria-haspopup='true'
          size='small'
          sx={{ ml: 2 }}
          onClick={toggleUserMenu}
        >
          <Avatar
            alt={authenticatedUser.fullName}
            {...stringAvatar(authenticatedUser.fullName)}
            src={
              authenticatedUser.photo
                ? `${BASE_URL.replace('/api', '')}/images/users/${authenticatedUser.photo}`
                : null
            }
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={openUserMenu}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id='account-menu'
        open={Boolean(openUserMenu)}
        slotProps={{ paper: { elevation: 0, sx: stylesAuthenticatedMenu } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClose={closeUserMenu}
      >
        <UserMenu
          authenticatedUser={authenticatedUser}
          closeUserMenu={closeUserMenu}
          menuItems={menuItemsData}
        />
      </Menu>
    </Box>
  );
}

export default AuthenticatedMenu;
