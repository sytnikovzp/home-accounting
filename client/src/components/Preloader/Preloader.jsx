import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import { stylesPreloaderMargin, stylesPreloaderTitle } from '../../styles';

function Preloader({ message = 'Завантаження даних...' }) {
  return (
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      sx={stylesPreloaderMargin}
    >
      <Typography style={stylesPreloaderTitle} variant='h5'>
        {message}
      </Typography>
      <Box width='100%'>
        <LinearProgress />
      </Box>
    </Box>
  );
}

export default Preloader;
