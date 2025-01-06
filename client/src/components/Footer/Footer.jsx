import { Box, Container, Link, Typography } from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';

import {
  stylesFooterBox,
  stylesFooterIcon,
  stylesFooterTypography,
} from '../../styles';

function Footer() {
  return (
    <Box component='footer' sx={stylesFooterBox}>
      <Container maxWidth='xl' sx={{ textAlign: 'center' }}>
        <Typography sx={stylesFooterTypography} variant='body1'>
          Designed by Alexandr Sytnikov © {new Date().getFullYear()}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Link
            href='https://github.com/sytnikovzp'
            sx={stylesFooterIcon}
            target='_blank'
          >
            <GitHub />
          </Link>
          <Link
            href='https://www.linkedin.com/in/sytnikovzp'
            sx={stylesFooterIcon}
            target='_blank'
          >
            <LinkedIn />
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
