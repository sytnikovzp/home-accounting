import { Typography } from '@mui/material';

function Error({ error }) {
  return (
    <Typography
      variant='h6'
      color='error'
      align='center'
      style={{ marginTop: '20px' }}
    >
      {error}
    </Typography>
  );
}

export default Error;
