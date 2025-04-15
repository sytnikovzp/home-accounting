import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import MenuIcon from '@mui/icons-material/Menu';

import useAuthUser from '../../hooks/useAuthUser';

import MobileDrawer from '../Navigation/MobileDrawer';

import AuthenticatedUserBlock from './AuthenticatedUserBlock';
import Logo from './Logo';

import { stylesHeaderAppBar, stylesHeaderToolbar } from '../../styles';

function Header() {
  const { isAuthenticated } = useAuthUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigateToAuth = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  return (
    <>
      <AppBar position='sticky' sx={stylesHeaderAppBar}>
        <Container maxWidth='xl'>
          <Toolbar disableGutters sx={stylesHeaderToolbar}>
            <Box display='flex'>
              {isMobile && (
                <IconButton color='inherit' onClick={toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
              )}
              <Logo isMobile={isMobile} />
            </Box>
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
      <MobileDrawer open={isDrawerOpen} onClose={toggleDrawer(false)} />
    </>
  );
}

export default Header;
