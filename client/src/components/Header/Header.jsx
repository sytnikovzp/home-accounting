import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AccountingIcon from '@mui/icons-material/AccountBalanceWallet';

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
          sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountingIcon
              fontSize='large'
              sx={{
                display: { xs: 'none', md: 'flex' },
                mr: 1,
                color: 'white',
                textShadow: '0px 0px 5px rgba(255, 255, 255, 0.8)',
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
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              sx={{ mr: 2 }}
            >
              <AccountingIcon />
            </IconButton>

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
                  // border: '2px solid rgba(56, 142, 60, 0.3)',
                  border: '2px solid #aaa',
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
