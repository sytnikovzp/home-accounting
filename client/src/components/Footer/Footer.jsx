import { useMemo } from 'react';
import { Box, Container, Link, Typography } from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import {
  stylesFooterBox,
  stylesFooterIcon,
  stylesFooterTypography,
} from '../../styles';

const socialLinks = [
  {
    href: 'https://github.com/sytnikovzp',
    icon: <GitHubIcon />,
  },
  {
    href: 'https://www.linkedin.com/in/sytnikovzp',
    icon: <LinkedInIcon />,
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
          {socialLinks.map(({ href, icon }) => (
            <Link
              key={href}
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
