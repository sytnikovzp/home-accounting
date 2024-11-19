import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// ==============================================================
import { logout } from '../../api';
// ==============================================================
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Avatar,
  Tooltip,
  Typography,
  Menu,
  IconButton,
  MenuItem,
  ListItemIcon,
  Button,
} from '@mui/material';
import { Logout, Settings } from '@mui/icons-material';
// ==============================================================
import NavBar from '../Navigation/NavBar';
import accountingIcon from '../../assets/accounting.png';

function Header({ isAuthenticated, setIsAuthenticated, setAuthModalOpen }) {
  const [openState, setOpenState] = useState({
    navBar: false,
    userAccount: false,
  });

  const navigate = useNavigate();

  const handleClick = (event) => {
    setOpenState({ ...openState, userAccount: event.currentTarget });
  };

  const handleClose = () => {
    setOpenState({ ...openState, userAccount: false });
  };

  const handleLogin = async () => {
    try {
      navigate('/auth');
      setAuthModalOpen(true);
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const handleToggleNavBar = () => {
    setOpenState({ ...openState, navBar: !openState.navBar });
  };

  return (
    <AppBar
      position='sticky'
      sx={{
        boxShadow: 3,
        backgroundImage: 'linear-gradient(to top, #9e9d24, #388e3c)',
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}
        >
          <Box
            component={RouterLink}
            to='/'
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <img
              src={accountingIcon}
              alt='Home Accounting'
              style={{
                width: '36px',
                height: '36px',
                marginRight: '16px',
                display: 'flex',
              }}
            />
            <Typography
              variant='h6'
              noWrap
              sx={{
                mr: 2,
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                letterSpacing: '.3rem',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Home Accounting
            </Typography>
          </Box>
          <Box
            sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}
          >
            <img
              src={accountingIcon}
              alt='Home Accounting'
              style={{
                width: '36px',
                height: '36px',
                marginRight: '16px',
                display: 'flex',
              }}
              onClick={handleToggleNavBar}
            />
            <Typography
              variant='h6'
              noWrap
              onClick={handleToggleNavBar}
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                letterSpacing: '.05rem',
                color: 'white',
                textAlign: 'center',
                alignSelf: 'center',
                display: { xs: 'flex', md: 'none' },
              }}
            >
              Home Accounting
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Tooltip title='Обліковий запис'>
                  <IconButton
                    onClick={handleClick}
                    size='small'
                    sx={{ ml: 2 }}
                    aria-controls={
                      openState.userAccount ? 'account-menu' : undefined
                    }
                    aria-haspopup='true'
                    aria-expanded={openState.userAccount ? 'true' : undefined}
                  >
                    <Avatar
                      // alt='Олександр Ситніков'
                      // src='https://avatars.githubusercontent.com/u/154733849?v=4'
                      sx={{
                        cursor: 'pointer',
                        border: '2px solid rgba(56, 142, 60, 0.3)',
                        width: 45,
                        height: 45,
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={openState.userAccount}
                  id='account-menu'
                  open={Boolean(openState.userAccount)}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Settings fontSize='small' />
                    </ListItemIcon>
                    Налаштування
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize='small' />
                    </ListItemIcon>
                    Вийти
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant='contained' color='success' onClick={handleLogin}>
                Увійти
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      {openState.navBar && <NavBar onClose={handleToggleNavBar} />}
    </AppBar>
  );
}

export default Header;
