import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import ModalWindow from './ModalWindow';

function InfoModal({ isOpen, onClose, title, message, severity = 'info' }) {
  console.log('title', title);
  console.log('message', message);
  console.log('severity', severity);

  return (
    <ModalWindow
      actions={
        <Box display='flex' justifyContent='center'>
          <Button
            fullWidth
            color='success'
            size='large'
            variant='contained'
            onClick={onClose}
          >
            Ок
          </Button>
        </Box>
      }
      content={<Alert severity={severity}>{message}</Alert>}
      isOpen={isOpen}
      title={title}
      onClose={onClose}
    />
  );
}

export default InfoModal;
