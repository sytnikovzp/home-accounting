import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import { stylesPreloaderBox } from '../../styles';

function Preloader({ message = 'Завантаження даних...' }) {
  return (
    <Box sx={stylesPreloaderBox}>
      <Typography variant='h6'>{message}</Typography>
      <LinearProgress color='success' sx={{ width: '100%' }} />
    </Box>
  );
}

export default Preloader;
