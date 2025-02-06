import { useCallback, useState } from 'react';
import { Avatar, Box, IconButton, Menu, Tooltip } from '@mui/material';

import { configs } from '../../constants';
import { stringAvatar } from '../../utils/sharedFunctions';
import useAuthUser from '../../hooks/useAuthUser';

import UserMenu from './UserMenu/UserMenu';
import WelcomeBlock from './WelcomeBlock';

import { stylesAuthenticatedMenu } from '../../styles';

const { BASE_URL } = configs;

function AuthenticatedMenu() {
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const { authenticatedUser } = useAuthUser();

  const fullName = authenticatedUser?.fullName || 'Невідомий користувач';
  const photo = authenticatedUser?.photo;

  const toggleUserMenu = useCallback(
    (event) => setOpenUserMenu(event.currentTarget),
    []
  );

  const closeUserMenu = useCallback(() => setOpenUserMenu(false), []);

  return (
    <Box sx={{ alignItems: 'center', display: 'flex' }}>
      <WelcomeBlock />
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
            alt={fullName}
            {...stringAvatar(fullName)}
            src={
              photo
                ? `${BASE_URL.replace('/api', '')}/images/users/${photo}`
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
        <UserMenu closeUserMenu={closeUserMenu} />
      </Menu>
    </Box>
  );
}

export default AuthenticatedMenu;
