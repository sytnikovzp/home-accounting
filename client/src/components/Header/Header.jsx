import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Divider,
} from '@mui/material';
import { Logout, Settings } from '@mui/icons-material';
// ==============================================================
import {
  stylesAppBar,
  stylesHeaderIcon,
  stylesHeaderTitleDesktop,
  stylesBoxLogoDesktop,
  stylesToolbar,
  stylesBoxLogoMobile,
  stylesHeaderTitleMobile,
  stylesUserMenu,
} from '../../styles/theme';
// ==============================================================
import { BASE_URL } from '../../constants';
import { stringAvatar } from '../../utils/sharedFunctions';
import restController from '../../api/rest/restController';
// ==============================================================
import NavBar from '../Navigation/NavBar';
import accountingIcon from '../../assets/accounting.png';

function Header({
  isAuthenticated,
  userProfile,
  setIsAuthenticated,
  setAuthModalOpen,
}) {
  const [openState, setOpenState] = useState({
    navBar: false,
    userAccount: false,
  });

  const navigate = useNavigate();

  const handleToggleNavBar = () => {
    setOpenState({ ...openState, navBar: !openState.navBar });
  };

  const toggleMenu = (event) => {
    setOpenState({ ...openState, userAccount: event.currentTarget });
  };

  const closeMenu = () => {
    setOpenState({ ...openState, userAccount: false });
  };

  const openAuthModal = () => {
    navigate('/auth');
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await restController.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Помилка виходу із системи:', error.message);
    }
  };

  return (
    <AppBar position='sticky' sx={stylesAppBar}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={stylesToolbar}>
          <Box component={RouterLink} to='/' sx={stylesBoxLogoDesktop}>
            <img
              src={accountingIcon}
              alt='Home Accounting'
              style={stylesHeaderIcon}
            />
            <Typography variant='h6' noWrap sx={stylesHeaderTitleDesktop}>
              Home Accounting
            </Typography>
          </Box>
          <Box sx={stylesBoxLogoMobile}>
            <img
              src={accountingIcon}
              alt='Home Accounting'
              onClick={handleToggleNavBar}
              style={stylesHeaderIcon}
            />
            <Typography
              variant='h6'
              noWrap
              onClick={handleToggleNavBar}
              sx={stylesHeaderTitleMobile}
            >
              Home Accounting
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Tooltip title='Обліковий запис'>
                  <IconButton
                    size='small'
                    onClick={toggleMenu}
                    sx={{ ml: 2 }}
                    aria-controls={
                      openState.userAccount ? 'account-menu' : undefined
                    }
                    aria-haspopup='true'
                    aria-expanded={openState.userAccount ? 'true' : undefined}
                  >
                    <Avatar
                      alt={userProfile.fullName}
                      {...stringAvatar(userProfile.fullName)}
                      src={
                        userProfile?.photo
                          ? `${BASE_URL.replace('/api/', '')}/images/users/${
                              userProfile.photo
                            }`
                          : undefined
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={openState.userAccount}
                  id='account-menu'
                  open={Boolean(openState.userAccount)}
                  onClick={closeMenu}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: stylesUserMenu,
                    },
                  }}
                  transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                  }}
                  anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom',
                  }}
                >
                  <MenuItem onClick={closeMenu}>
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
              <Button
                variant='contained'
                color='success'
                onClick={openAuthModal}
              >
                Увійти
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      <Divider sx={{ borderWidth: '1px' }} />
      {openState.navBar && <NavBar onClose={handleToggleNavBar} />}
    </AppBar>
  );
}

export default Header;
