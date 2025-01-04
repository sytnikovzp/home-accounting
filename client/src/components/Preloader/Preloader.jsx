import { Box, LinearProgress, Typography } from '@mui/material';

import { stylesPreloaderMargin, stylesPreloaderTitle } from '../../styles';

function Preloader({ message = 'Завантаження даних...' }) {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      sx={stylesPreloaderMargin}
    >
      <Typography variant='h5' style={stylesPreloaderTitle}>
        {message}
      </Typography>
      <Box width='100%'>
        <LinearProgress />
      </Box>
    </Box>
  );
}

export default Preloader;
