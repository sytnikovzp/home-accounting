import { useCallback, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';

import { API_CONFIG } from '../../constants';
import { stringAvatar } from '../../utils/stringHelpers';
import useAuthentication from '../../hooks/useAuthentication';

import UserMenu from './UserMenu/UserMenu';
import Welcome from './Welcome';

import {
  stylesAuthenticatedUserBlockBox,
  stylesAuthenticatedUserBlockIconButton,
  stylesAuthenticatedUserBlockMenu,
  stylesAuthenticatedUserBlockMenuAnchor,
  stylesAuthenticatedUserBlockMenuTransform,
} from '../../styles';

const slotPropsPaper = {
  paper: {
    elevation: 0,
    sx: stylesAuthenticatedUserBlockMenu,
  },
};

function AuthenticatedUserBlock() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { authenticatedUser } = useAuthentication();

  const fullName = authenticatedUser?.fullName || 'Невідомий користувач';
  const photo = authenticatedUser?.photo || null;

  const handleToggleUserMenu = useCallback(
    (event) => setIsUserMenuOpen(event.currentTarget),
    []
  );
  const handleCloseUserMenu = useCallback(() => setIsUserMenuOpen(false), []);

  return (
    <Box sx={stylesAuthenticatedUserBlockBox}>
      <Welcome />
      <Tooltip title='Обліковий запис'>
        <IconButton
          aria-controls={isUserMenuOpen ? 'account-menu' : null}
          aria-expanded={isUserMenuOpen ? 'true' : null}
          aria-haspopup='true'
          size='small'
          sx={stylesAuthenticatedUserBlockIconButton}
          onClick={handleToggleUserMenu}
        >
          <Avatar
            alt={fullName}
            {...stringAvatar(fullName)}
            src={
              photo
                ? `${API_CONFIG.BASE_URL.replace('/api', '')}/images/users/${photo}`
                : null
            }
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={isUserMenuOpen}
        anchorOrigin={stylesAuthenticatedUserBlockMenuAnchor}
        id='account-menu'
        open={Boolean(isUserMenuOpen)}
        slotProps={slotPropsPaper}
        transformOrigin={stylesAuthenticatedUserBlockMenuTransform}
        onClose={handleCloseUserMenu}
      >
        <UserMenu closeUserMenu={handleCloseUserMenu} />
      </Menu>
    </Box>
  );
}

export default AuthenticatedUserBlock;
