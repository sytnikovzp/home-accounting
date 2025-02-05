import { Box, Typography } from '@mui/material';

import { stylesWelcomeBlockBox } from '../../styles';

function WelcomeBlock({ authenticatedUser }) {
  const fullName = authenticatedUser?.fullName || 'Невідомий користувач';
  const roleTitle = authenticatedUser?.role?.title || 'невідома роль';

  return (
    <Box sx={stylesWelcomeBlockBox}>
      <Typography variant='body1'>Привіт, {fullName}!</Typography>
      <Typography color='text.secondary' variant='body2'>
        Ваша роль на сайті: {roleTitle}
      </Typography>
    </Box>
  );
}

export default WelcomeBlock;
