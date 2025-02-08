import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useAuthUser from '../../hooks/useAuthUser';

import { stylesWelcomeBox } from '../../styles';

function Welcome() {
  const { authenticatedUser } = useAuthUser();

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
