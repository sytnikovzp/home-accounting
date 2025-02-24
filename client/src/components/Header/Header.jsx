import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';

import useAuthUser from '../../hooks/useAuthUser';

import AuthenticatedUserBlock from './AuthenticatedUserBlock';
import Logo from './Logo';

import { stylesHeaderAppBar, stylesHeaderToolbar } from '../../styles';

function Header() {
  const { isAuthenticated } = useAuthUser();
  const navigate = useNavigate();

  const handleNavigateToAuth = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  return (
    <AppBar position='sticky' sx={stylesHeaderAppBar}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={stylesHeaderToolbar}>
          <Logo />
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
    </AppBar>
  );
}

export default Header;
