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
  Button,
  Divider,
} from '@mui/material';
import {
  AdminPanelSettings,
  ListAlt,
  Logout,
  Password,
  Portrait,
} from '@mui/icons-material';
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
import UserMenu from '../UserMenu/UserMenu';
import accountingIcon from '../../assets/accounting.png';

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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    alignItems: 'center',
                    marginRight: 2,
                  }}
                >
                  <Typography variant='body1'>
                    Привіт, {currentUser.fullName}!
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Ваша роль на сайті: {currentUser.role.title}
                  </Typography>
                </Box>
                <Tooltip title='Обліковий запис'>
                  <IconButton
                    size='small'
                    onClick={toggleUserMenu}
                    sx={{ ml: 2 }}
                    aria-controls={openUserMenu ? 'account-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={openUserMenu ? 'true' : undefined}
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
                  id='account-menu'
                  open={Boolean(openUserMenu)}
                  onClose={closeMenu}
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
                  <UserMenu
                    menuItems={menuItemsData}
                    currentUser={currentUser}
                    navigateTo={navigateTo}
                    closeMenu={closeMenu}
                    handleLogout={handleLogout}
                  />
                </Menu>
              </Box>
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
      {openNavBar && <NavBar onClose={handleToggleNavBar} />}
    </AppBar>
  );
}

export default Header;
