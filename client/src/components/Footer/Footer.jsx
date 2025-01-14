import { useMemo } from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';

import {
  stylesFooterBox,
  stylesFooterIcon,
  stylesFooterTypography,
} from '../../styles';

const socialLinks = [
  {
    href: 'https://github.com/sytnikovzp',
    icon: <GitHub />,
  },
  {
    href: 'https://www.linkedin.com/in/sytnikovzp',
    icon: <LinkedIn />,
  },
];

function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <Box component='footer' sx={stylesFooterBox}>
      <Container maxWidth='xl' sx={{ textAlign: 'center' }}>
        <Typography sx={stylesFooterTypography} variant='body1'>
          Designed by Alexandr Sytnikov © {currentYear}
        </Typography>
        <Box sx={{ mt: 1 }}>
          {socialLinks.map(({ href, icon }, index) => (
            <Link
              key={index}
              href={href}
              rel='noopener noreferrer'
              sx={stylesFooterIcon}
              target='_blank'
            >
              {icon}
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
