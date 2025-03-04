import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import ModalWindow from './ModalWindow';

function InfoModal({ message, severity = 'info', title, onClose }) {
  const actions = (
    <Box display='flex' justifyContent='center'>
      <Button fullWidth color='success' variant='contained' onClick={onClose}>
        Закрити
      </Button>
    </Box>
  );

  const content = <Alert severity={severity}>{message}</Alert>;

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      title={title}
      onClose={onClose}
    />
  );
}

export default InfoModal;
