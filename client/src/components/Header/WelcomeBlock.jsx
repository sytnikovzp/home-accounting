import { Box, Typography } from '@mui/material';

import { stylesWelcomeBlockBox } from '../../styles';

function WelcomeBlock({ currentUser }) {
  return (
    <Box sx={stylesWelcomeBlockBox}>
      <Typography variant='body1'>Привіт, {currentUser.fullName}!</Typography>
      <Typography color='text.secondary' variant='body2'>
        Ваша роль на сайті: {currentUser.role.title}
      </Typography>
    </Box>
  );
}

export default WelcomeBlock;
