import Typography from '@mui/material/Typography';

import { stylesErrorTypography } from '@/src/styles';

function Error({ message }) {
  return (
    <Typography
      align='center'
      color='error'
      sx={stylesErrorTypography}
      variant='h6'
    >
      {message}
    </Typography>
  );
}

export default Error;
