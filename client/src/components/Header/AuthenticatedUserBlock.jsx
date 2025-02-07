import { useCallback, useState } from 'react';
import { Avatar, Box, IconButton, Menu, Tooltip } from '@mui/material';

import { configs } from '../../constants';
import { stringAvatar } from '../../utils/sharedFunctions';
import useAuthUser from '../../hooks/useAuthUser';

import UserMenu from './UserMenu/UserMenu';
import Welcome from './Welcome';

import { stylesAuthenticatedMenu } from '../../styles';

const { BASE_URL } = configs;

function AuthenticatedUserBlock() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { authenticatedUser } = useAuthUser();

  const fullName = authenticatedUser?.fullName || 'Невідомий користувач';
  const photo = authenticatedUser?.photo || null;

  const handleToggleUserMenu = useCallback(
    (event) => setIsUserMenuOpen(event.currentTarget),
    []
  );

  const handleCloseUserMenu = useCallback(() => setIsUserMenuOpen(false), []);

  return (
    <Box sx={{ alignItems: 'center', display: 'flex' }}>
      <Welcome />
      <Tooltip title='Обліковий запис'>
        <IconButton
          aria-controls={isUserMenuOpen ? 'account-menu' : null}
          aria-expanded={isUserMenuOpen ? 'true' : null}
          aria-haspopup='true'
          size='small'
          sx={{ ml: 2 }}
          onClick={handleToggleUserMenu}
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
        anchorEl={isUserMenuOpen}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id='account-menu'
        open={Boolean(isUserMenuOpen)}
        slotProps={{ paper: { elevation: 0, sx: stylesAuthenticatedMenu } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClose={handleCloseUserMenu}
      >
        <UserMenu closeUserMenu={handleCloseUserMenu} />
      </Menu>
    </Box>
  );
}

export default AuthenticatedUserBlock;
