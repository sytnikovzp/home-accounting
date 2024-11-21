import { Box, Container, Link, Typography } from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';
// ==============================================================
import { stylesFooterBox, stylesFooterIcon } from '../../styles/theme';

function Footer() {
  return (
    <Box component='footer' sx={stylesFooterBox}>
      <Container maxWidth='xl' sx={{ textAlign: 'center' }}>
        <Typography variant='body1' sx={{ color: '#555' }}>
          Designed by Alexandr Sytnikov © {new Date().getFullYear()}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Link
            href='https://github.com/sytnikovzp'
            target='_blank'
            sx={stylesFooterIcon}
          >
            <GitHub />
          </Link>
          <Link
            href='https://www.linkedin.com/in/sytnikovzp'
            target='_blank'
            sx={stylesFooterIcon}
          >
            <LinkedIn />
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
