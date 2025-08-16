import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useAuthentication from '@/src/hooks/useAuthentication';

import { stylesWelcomeBox } from '@/src/styles';

function Welcome() {
  const { authenticatedUser } = useAuthentication();

  const fullName = authenticatedUser?.fullName || 'Невідомий користувач';
  const roleTitle = authenticatedUser?.role?.title || 'невідома роль';

  return (
    <Box sx={stylesWelcomeBox}>
      <Typography variant='body1'>Привіт, {fullName}!</Typography>
      <Typography color='text.secondary' variant='body2'>
        Ваша роль на сайті: {roleTitle}
      </Typography>
    </Box>
  );
}

export default Welcome;
