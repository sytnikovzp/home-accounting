import { Typography } from '@mui/material';

function Error({ error }) {
  return (
    <Typography variant='h6' color='error' align='center' sx={{ m: 2 }}>
      {error}
    </Typography>
  );
}

export default Error;
