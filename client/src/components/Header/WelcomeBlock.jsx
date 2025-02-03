import { Box, Typography } from '@mui/material';

import { stylesWelcomeBlockBox } from '../../styles';

function WelcomeBlock({ currentUser }) {
  const fullName = currentUser?.fullName || 'Невідомий користувач';
  const roleTitle = currentUser?.role?.title || 'невідома роль';

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
