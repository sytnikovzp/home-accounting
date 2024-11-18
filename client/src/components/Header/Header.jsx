import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Modal,
  Fade,
} from '@mui/material';
import { Logout, Settings } from '@mui/icons-material';
// ==============================================================
import NavBar from '../Navigation/NavBar';
import AuthForm from '../AuthForm/AuthForm';
import accountingIcon from '../../assets/accounting.png';

function Header({ isAuthenticated, setIsAuthenticated }) {
  const [openNavBar, setOpenNavBar] = useState(false);
  const [openUserAccount, setOpenUserAccount] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const handleClick = (event) => {
    setOpenUserAccount(event.currentTarget);
  };

  const handleClose = () => {
    setOpenUserAccount(false);
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
    setOpenNavBar(!openNavBar);
  };

  const handleCloseNavBar = () => {
    setOpenNavBar(false);
  };

  const handleOpenAuthModal = () => {
    setOpenAuthModal(!openAuthModal);
  };

  const handleCloseAuthModal = () => {
    setOpenAuthModal(false);
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
                    aria-controls={openUserAccount ? 'account-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={openUserAccount ? 'true' : undefined}
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
                  anchorEl={openUserAccount}
                  id='account-menu'
                  open={Boolean(openUserAccount)}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 24,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
              <>
                <Button
                  variant='contained'
                  color='success'
                  onClick={handleOpenAuthModal}
                >
                  Увійти
                </Button>
                <Modal
                  open={openAuthModal}
                  onClose={handleCloseAuthModal}
                  closeAfterTransition
                  aria-labelledby='login-modal-title'
                  aria-describedby='login-modal-description'
                >
                  <Fade in={openAuthModal}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: {
                          xs: '90%',
                          sm: 400,
                          md: 400,
                        },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                      }}
                    >
                      <AuthForm setIsAuthenticated={setIsAuthenticated} />
                    </Box>
                  </Fade>
                </Modal>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
      {openNavBar && <NavBar onClose={handleCloseNavBar} />}
    </AppBar>
  );
}

export default Header;
