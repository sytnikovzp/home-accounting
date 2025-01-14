import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import accountingIcon from '../../assets/accounting.png';
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
      <img alt='Home Accounting' src={accountingIcon} style={stylesLogoIcon} />
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
