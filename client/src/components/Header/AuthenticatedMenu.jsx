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
    label: 'Переглянути профіль',
    icon: <Portrait fontSize='small' />,
    action: (user) => `/users/${user.uuid}`,
  },
  {
    label: 'Редагувати профіль',
    icon: <ListAlt fontSize='small' />,
    action: (user) => `/users/edit/${user.uuid}`,
  },
  {
    label: 'Переглянути права',
    icon: <AdminPanelSettings fontSize='small' />,
    action: (user) => `/roles/${user.role.uuid}`,
  },
  {
    label: 'Змінити пароль',
    icon: <Password fontSize='small' />,
    action: (user) => `/users/password/${user.uuid}`,
  },
  {
    label: 'Вийти',
    icon: <Logout fontSize='small' />,
    action: 'handleLogout',
    isLogout: true,
  },
];

const { BASE_URL } = configs;

function AuthenticatedMenu({
  closeMenu,
  currentUser,
  handleLogout,
  navigateTo,
  openUserMenu,
  toggleUserMenu,
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <WelcomeBlock currentUser={currentUser} />
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
            alt={currentUser.fullName}
            {...stringAvatar(currentUser.fullName)}
            src={
              currentUser.photo
                ? `${BASE_URL.replace('/api/', '')}/images/users/${currentUser.photo}`
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
        onClose={closeMenu}
      >
        <UserMenu
          closeMenu={closeMenu}
          currentUser={currentUser}
          handleLogout={handleLogout}
          menuItems={menuItemsData}
          navigateTo={navigateTo}
        />
      </Menu>
    </Box>
  );
}

export default AuthenticatedMenu;
