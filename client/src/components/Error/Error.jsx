import { Typography } from '@mui/material';

import { stylesErrorTypography } from '../../styles';

function Error({ error }) {
  return (
    <Typography
      align='center'
      color='error'
      sx={stylesErrorTypography}
      variant='h6'
    >
      {error}
    </Typography>
  );
}

export default Error;
