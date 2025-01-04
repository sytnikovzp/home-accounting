import { Typography } from '@mui/material';

function Error({ error }) {
  return (
    <Typography align='center' color='error' sx={{ m: 2 }} variant='h6'>
      {error}
    </Typography>
  );
}

export default Error;
