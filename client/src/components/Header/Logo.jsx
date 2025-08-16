import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { API_CONFIG } from '@/src/constants';

import {
  stylesLogoBoxDesktop,
  stylesLogoBoxMobile,
  stylesLogoIcon,
  stylesLogoTypographyDesktop,
  stylesLogoTypographyMobile,
} from '@/src/styles';

function Logo({ isMobile }) {
  return (
    <Box
      component={RouterLink}
      sx={isMobile ? stylesLogoBoxMobile : stylesLogoBoxDesktop}
      to='/'
    >
      {!isMobile && (
        <img
          alt='Home Accounting'
          src={`${API_CONFIG.BASE_URL.replace('/api', '')}/images/logo.png`}
          style={stylesLogoIcon}
        />
      )}
      <Typography
        noWrap
        sx={isMobile ? stylesLogoTypographyMobile : stylesLogoTypographyDesktop}
        variant='h6'
      >
        Home Accounting
      </Typography>
    </Box>
  );
}

export default Logo;
