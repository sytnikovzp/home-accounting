import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Toolbar,
} from '@mui/material';

import restController from '../../api/rest/restController';

import { selectProfile } from '../../store/selectors/profileSelectors';

import NavBar from '../Navigation/NavBar';

import AuthenticatedMenu from './AuthenticatedMenu';
import Logo from './Logo';

import { stylesHeaderAppBar, stylesHeaderToolbar } from '../../styles';

function Header({ setAuthModalOpen }) {
  const [openNavBar, setOpenNavBar] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const currentUser = useSelector(selectProfile);

  const isAuthenticated = Boolean(currentUser);

  const navigate = useNavigate();
  const navigateTo = (path) => navigate(path);
  const handleToggleNavBar = () => setOpenNavBar((prev) => !prev);
  const toggleUserMenu = (event) => setOpenUserMenu(event.currentTarget);
  const closeMenu = () => setOpenUserMenu(false);

  const openAuthModal = () => setAuthModalOpen(true);

  const handleLogout = async () => {
    try {
      await restController.logout();
      navigate('/');
    } catch (error) {
      console.error('Помилка виходу із системи:', error.message);
    }
  };

  return (
    <AppBar position='sticky' sx={stylesHeaderAppBar}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={stylesHeaderToolbar}>
          <Logo isMobile={false} />
          <Logo isMobile onClick={handleToggleNavBar} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <AuthenticatedMenu
                closeMenu={closeMenu}
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
