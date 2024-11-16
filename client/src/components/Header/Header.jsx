import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import accountingIcon from '../../assets/accounting.png';

function Header() {
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              component='a'
              href='/'
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
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
            <Typography
              variant='h6'
              sx={{ color: 'white', display: { xs: 'flex', md: 'none' } }}
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
    </AppBar>
  );
}

export default Header;
