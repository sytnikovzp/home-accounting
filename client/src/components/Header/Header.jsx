import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Divider,
  ListItemIcon,
} from '@mui/material';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';
// ==============================================================
import NavBar from '../Navigation/NavBar';
import accountingIcon from '../../assets/accounting.png';

function Header() {
  const [navBarOpen, setNavBarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleNavBar = () => {
    setNavBarOpen(!navBarOpen);
  };

  const handleCloseNavBar = () => {
    setNavBarOpen(false);
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
                letterSpacing: '.1rem',
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
            <Tooltip title='Обліковий запис'>
              <IconButton
                onClick={handleClick}
                size='small'
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar
                  alt='Олександр Ситніков'
                  src='https://avatars.githubusercontent.com/u/154733849?v=4'
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
              anchorEl={anchorEl}
              id='account-menu'
              open={open}
              onClose={handleClose}
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
                <Avatar /> Профіль
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> Мій аккаунт
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize='small' />
                </ListItemIcon>
                Додати інший аккаунт
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize='small' />
                </ListItemIcon>
                Налаштування
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize='small' />
                </ListItemIcon>
                Вийти
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      {navBarOpen && <NavBar onClose={handleCloseNavBar} />}
    </AppBar>
  );
}

export default Header;
