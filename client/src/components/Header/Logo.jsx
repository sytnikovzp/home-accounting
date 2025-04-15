import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import accountingLogo from '../../assets/logo.png';
import {
  stylesLogoBoxDesktop,
  stylesLogoBoxMobile,
  stylesLogoIcon,
  stylesLogoTypographyDesktop,
  stylesLogoTypographyMobile,
} from '../../styles';

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
          src={accountingLogo}
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
