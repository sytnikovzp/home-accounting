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

import useAuthUser from '../../hooks/useAuthUser';

import NavBar from '../Navigation/NavBar';

import AuthenticatedUserBlock from './AuthenticatedUserBlock';
import Logo from './Logo';

import { stylesHeaderAppBar, stylesHeaderToolbar } from '../../styles';

function Header() {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const { isAuthenticated } = useAuthUser();
  const navigate = useNavigate();

  const handleToggleNavBar = useCallback(
    () => setIsNavBarOpen((prev) => !prev),
    []
  );

  const handleNavigateToAuth = useCallback(() => {
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
              <AuthenticatedUserBlock />
            ) : (
              <Button
                color='success'
                variant='contained'
                onClick={handleNavigateToAuth}
              >
                Увійти
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      <Divider sx={{ borderWidth: '1px' }} />
      {isNavBarOpen && <NavBar onClose={handleToggleNavBar} />}
    </AppBar>
  );
}

export default Header;
