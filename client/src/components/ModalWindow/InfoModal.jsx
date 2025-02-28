import { useMemo } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import ModalWindow from './ModalWindow';

function InfoModal({ isOpen, onClose, title, message, severity = 'info' }) {
  const actions = useMemo(
    () => (
      <Box display='flex' justifyContent='center'>
        <Button fullWidth color='success' variant='contained' onClick={onClose}>
          Закрити
        </Button>
      </Box>
    ),
    [onClose]
  );

  const content = useMemo(
    () => <Alert severity={severity}>{message}</Alert>,
    [message, severity]
  );

  return (
    <ModalWindow
      actions={actions}
      content={content}
      isOpen={isOpen}
      title={title}
      onClose={onClose}
    />
  );
}

export default InfoModal;
