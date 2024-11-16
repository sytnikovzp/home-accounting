import { Box, LinearProgress, Typography } from '@mui/material';

const Preloader = ({ message = 'Завантаження...' }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      width='100%'
      padding='0 20px'
    >
      <Typography
        variant='h6'
        style={{ marginBottom: '20px', textAlign: 'center' }}
      >
        {message}
      </Typography>
      <Box width='100%'>
        <LinearProgress />
      </Box>
    </Box>
  );
};

export default Preloader;
