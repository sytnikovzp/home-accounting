import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Toolbar,
} from '@mui/material';

import { getAccessToken } from '../../utils/sharedFunctions';
import {
  useFetchUserProfileQuery,
  useLogoutMutation,
} from '../../store/services';

import NavBar from '../Navigation/NavBar';

import AuthenticatedMenu from './AuthenticatedMenu';
import Logo from './Logo';

import { stylesHeaderAppBar, stylesHeaderToolbar } from '../../styles';

function Header() {
  const [openNavBar, setOpenNavBar] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  const accessToken = getAccessToken();

  const { data, isSuccess } = useFetchUserProfileQuery(null, {
    skip: !accessToken,
  });

  // console.log('isAuthenticated', isAuthenticated);
  // console.log('currentUser', currentUser);

  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    console.log('Triggered useEffect', { isSuccess, data });

    if (isSuccess && data) {
      setIsAuthenticated(true);
      setCurrentUser(data);
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, [isSuccess, data]);

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

  const handleLogout = useCallback(async () => {
    await logoutMutation();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  }, [logoutMutation, navigate]);

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
                handleLogout={handleLogout}
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
