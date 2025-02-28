import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

function Preloader({ message = 'Завантаження даних...' }) {
  return (
    <Box alignItems='center' display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6'>{message}</Typography>
      <LinearProgress sx={{ width: '100%' }} />
    </Box>
  );
}

export default Preloader;
