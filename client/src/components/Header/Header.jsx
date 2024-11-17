import { useState } from 'react';
import { Link } from 'react-router-dom';
// ==============================================================
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Avatar,
  Tooltip,
  Typography,
} from '@mui/material';
// ==============================================================
import NavBar from '../Navigation/NavBar';
import accountingIcon from '../../assets/accounting.png';

function Header() {
  const [navBarOpen, setNavBarOpen] = useState(false);

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
            component={Link}
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
                letterSpacing: '.3rem',
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
            <Tooltip title='Open settings'>
              <Avatar
                alt='Alexandr Sytnikov'
                src='https://avatars.githubusercontent.com/u/154733849?v=4'
                sx={{
                  cursor: 'pointer',
                  border: '2px solid rgba(56, 142, 60, 0.3)',
                  width: 45,
                  height: 45,
                }}
              />
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
      {navBarOpen && <NavBar onClose={handleCloseNavBar} />}
    </AppBar>
  );
}

export default Header;
