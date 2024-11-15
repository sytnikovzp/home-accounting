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
        py: 3,
        backgroundImage:
          'linear-gradient(to top, #a5d6a7, rgba(165, 214, 167, 0))', 
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container maxWidth='xl' sx={{ textAlign: 'center' }}>
        <Typography variant='body1'>
          Designed by Alexandr Sytnikov © {new Date().getFullYear()}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Link
            href='https://github.com/sytnikovzp'
            target='_blank'
            sx={{ mx: 1, color: '#555' }}
          >
            <GitHub />
          </Link>
          <Link
            href='https://www.linkedin.com/in/sytnikovzp'
            target='_blank'
            sx={{ mx: 1, color: '#555' }}
          >
            <LinkedIn />
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
