import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { GitHub, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component='footer'
      sx={{
        py: 1.5,
        backgroundImage:
          'linear-gradient(to top, #c8e6c9, rgba(200, 230, 201, 0.5))',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth='xl' sx={{ textAlign: 'center' }}>
        <Typography variant='body1' sx={{ color: '#555' }}>
          Designed by Alexandr Sytnikov © {new Date().getFullYear()}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Link
            href='https://github.com/sytnikovzp'
            target='_blank'
            sx={{
              mx: 1,
              color: '#555',
              transition: 'color 0.3s ease',
              '&:hover': { color: '#2E7D32' },
            }}
          >
            <GitHub />
          </Link>
          <Link
            href='https://www.linkedin.com/in/sytnikovzp'
            target='_blank'
            sx={{
              mx: 1,
              color: '#555',
              transition: 'color 0.3s ease',
              '&:hover': { color: '#2E7D32' },
            }}
          >
            <LinkedIn />
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
