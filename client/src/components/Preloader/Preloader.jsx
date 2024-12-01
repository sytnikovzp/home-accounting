import { Box, LinearProgress, Typography } from '@mui/material';
// ==============================================================
import { stylesPreloaderTitle } from '../../styles/theme';

function Preloader({ message = 'Завантаження...' }) {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      sx={{ m: 2 }}
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
