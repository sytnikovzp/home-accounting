import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import ModalWindow from './ModalWindow';

function LoadingModal({ message = 'Завантаження...' }) {
  const content = (
    <Box alignItems='center' display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6'>{message}</Typography>
      <LinearProgress sx={{ width: '100%' }} />
    </Box>
  );

  return <ModalWindow disableCloseButton isOpen content={content} />;
}

export default LoadingModal;
