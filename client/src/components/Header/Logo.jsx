import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import accountingLogo from '../../assets/logo.png';
import {
  stylesLogoBoxDesktop,
  stylesLogoBoxMobile,
  stylesLogoIcon,
  stylesLogoTypographyDesktop,
  stylesLogoTypographyMobile,
} from '../../styles';

function Logo({ isMobile, onClick }) {
  return (
    <Box
      component={RouterLink}
      sx={isMobile ? stylesLogoBoxMobile : stylesLogoBoxDesktop}
      to='/'
      onClick={isMobile ? onClick : null}
    >
      <img alt='Home Accounting' src={accountingLogo} style={stylesLogoIcon} />
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
