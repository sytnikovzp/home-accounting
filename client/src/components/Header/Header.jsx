import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AdminPanelSettings,
  ListAlt,
  Logout,
  Password,
  Portrait,
} from '@mui/icons-material';

import { BASE_URL } from '../../constants';
import { stringAvatar } from '../../utils/sharedFunctions';
import restController from '../../api/rest/restController';

import NavBar from '../Navigation/NavBar';
import UserMenu from '../UserMenu/UserMenu';

import accountingIcon from '../../assets/accounting.png';
import {
  stylesHeaderAppBar,
  stylesHeaderBoxLogoDesktop,
  stylesHeaderBoxLogoMobile,
  stylesHeaderIcon,
  stylesHeaderTitleDesktop,
  stylesHeaderTitleMobile,
  stylesHeaderToolbar,
  stylesHeaderUserMenu,
  stylesHeaderWelcomeBlock,
} from '../../styles';

const menuItemsData = [
  {
    label: 'Переглянути профіль',
    icon: <Portrait fontSize='small' />,
    action: (currentUser) => `/users/${currentUser.uuid}`,
  },
  {
    label: 'Редагувати профіль',
    icon: <ListAlt fontSize='small' />,
    action: (currentUser) => `/users/edit/${currentUser.uuid}`,
  },
  {
    label: 'Переглянути права',
    icon: <AdminPanelSettings fontSize='small' />,
    action: (currentUser) => `/roles/${currentUser.role.uuid}`,
  },
  {
    label: 'Змінити пароль',
    icon: <Password fontSize='small' />,
    action: (currentUser) => `/users/password/${currentUser.uuid}`,
  },
  {
    label: 'Вийти',
    icon: <Logout fontSize='small' />,
    action: 'handleLogout',
    isLogout: true,
  },
];

function Header({
  isAuthenticated,
  currentUser,
  setIsAuthenticated,
  setAuthModalOpen,
}) {
  const [openNavBar, setOpenNavBar] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const navigate = useNavigate();
  const navigateTo = (path) => navigate(path);
  const handleToggleNavBar = () => setOpenNavBar((prev) => !prev);
  const toggleUserMenu = (event) => setOpenUserMenu(event.currentTarget);
  const closeMenu = () => setOpenUserMenu(false);

  const openAuthModal = () => {
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await restController.logout();
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Помилка виходу із системи:', error.message);
    }
  };

  return (
    <AppBar position='sticky' sx={stylesHeaderAppBar}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={stylesHeaderToolbar}>
          <Box component={RouterLink} sx={stylesHeaderBoxLogoDesktop} to='/'>
            <img
              alt='Home Accounting'
              src={accountingIcon}
              style={stylesHeaderIcon}
            />
            <Typography noWrap sx={stylesHeaderTitleDesktop} variant='h6'>
              Home Accounting
            </Typography>
          </Box>
          <Box sx={stylesHeaderBoxLogoMobile}>
            <img
              alt='Home Accounting'
              src={accountingIcon}
              style={stylesHeaderIcon}
              onClick={handleToggleNavBar}
            />
            <Typography
              noWrap
              sx={stylesHeaderTitleMobile}
              variant='h6'
              onClick={handleToggleNavBar}
            >
              Home Accounting
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={stylesHeaderWelcomeBlock}>
                  <Typography variant='body1'>
                    Привіт, {currentUser.fullName}!
                  </Typography>
                  <Typography color='text.secondary' variant='body2'>
                    Ваша роль на сайті: {currentUser.role.title}
                  </Typography>
                </Box>
                <Tooltip title='Обліковий запис'>
                  <IconButton
                    aria-controls={openUserMenu ? 'account-menu' : undefined}
                    aria-expanded={openUserMenu ? 'true' : undefined}
                    aria-haspopup='true'
                    size='small'
                    sx={{ ml: 2 }}
                    onClick={toggleUserMenu}
                  >
                    <Avatar
                      alt={currentUser.fullName}
                      {...stringAvatar(currentUser.fullName)}
                      src={
                        currentUser?.photo
                          ? `${BASE_URL.replace('/api/', '')}/images/users/${
                              currentUser.photo
                            }`
                          : undefined
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={openUserMenu}
                  anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom',
                  }}
                  id='account-menu'
                  open={Boolean(openUserMenu)}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: stylesHeaderUserMenu,
                    },
                  }}
                  transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                  }}
                  onClose={closeMenu}
                >
                  <UserMenu
                    closeMenu={closeMenu}
                    currentUser={currentUser}
                    handleLogout={handleLogout}
                    menuItems={menuItemsData}
                    navigateTo={navigateTo}
                  />
                </Menu>
              </Box>
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
