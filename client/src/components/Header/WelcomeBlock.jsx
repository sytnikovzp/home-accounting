import { Box, Typography } from '@mui/material';

import useAuthUser from '../../hooks/useAuthUser';

import { stylesWelcomeBlockBox } from '../../styles';

function WelcomeBlock() {
  const { authenticatedUser } = useAuthUser();

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
