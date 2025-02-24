import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import accountingLogo from '../../assets/logo.png';
import {
  stylesLogoBoxDesktop,
  stylesLogoBoxMobile,
  stylesLogoIcon,
  stylesLogoTypographyDesktop,
  stylesLogoTypographyMobile,
} from '../../styles';

function Logo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component={RouterLink}
      sx={isMobile ? stylesLogoBoxMobile : stylesLogoBoxDesktop}
      to='/'
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
