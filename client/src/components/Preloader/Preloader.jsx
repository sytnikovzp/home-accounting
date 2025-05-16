import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import { stylesPreloaderBox, stylesPreloaderProgress } from '../../styles';

function Preloader({ message = 'Завантаження даних...' }) {
  return (
    <Box sx={stylesPreloaderBox}>
      <Typography variant='h6'>{message}</Typography>
      <LinearProgress color='success' sx={stylesPreloaderProgress} />
    </Box>
  );
}

export default Preloader;
