import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Toolbar,
} from '@mui/material';

import { useAuth } from '../../hooks/useAuth';

import NavBar from '../Navigation/NavBar';

import AuthenticatedMenu from './AuthenticatedMenu';
import Logo from './Logo';

import { stylesHeaderAppBar, stylesHeaderToolbar } from '../../styles';

function Header() {
  const [openNavBar, setOpenNavBar] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const navigate = useNavigate();

  const { currentUser, isAuthenticated, logout } = useAuth();

  console.log('isAuthenticated', isAuthenticated);
  console.log('currentUser', currentUser);

  const navigateTo = useCallback((path) => navigate(path), [navigate]);

  const handleToggleNavBar = useCallback(
    () => setOpenNavBar((prev) => !prev),
    []
  );

  const toggleUserMenu = useCallback(
    (event) => setOpenUserMenu(event.currentTarget),
    []
  );

  const closeUserMenu = useCallback(() => setOpenUserMenu(false), []);

  const openAuthModal = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  return (
    <AppBar position='sticky' sx={stylesHeaderAppBar}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={stylesHeaderToolbar}>
          <Logo isMobile={false} />
          <Logo isMobile onClick={handleToggleNavBar} />
          <Box sx={{ alignItems: 'center', display: 'flex' }}>
            {isAuthenticated ? (
              <AuthenticatedMenu
                closeUserMenu={closeUserMenu}
                currentUser={currentUser}
                handleLogout={logout}
                navigateTo={navigateTo}
                openUserMenu={openUserMenu}
                toggleUserMenu={toggleUserMenu}
              />
            ) : (
              <Button
                color='success'
                variant='contained'
                onClick={openAuthModal}
              >
                Увійти
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      <Divider sx={{ borderWidth: '1px' }} />
      {openNavBar && <NavBar onClose={handleToggleNavBar} />}
    </AppBar>
  );
}

export default Header;
