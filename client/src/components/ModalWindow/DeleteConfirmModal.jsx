import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ModalWindow from './ModalWindow';

import { stylesRedlineTypography } from '../../styles';

function DeleteConfirmModal({
  error,
  isFetching,
  isSubmitting,
  message,
  title,
  onClose,
  onSubmit,
}) {
  const actions = (
    <Box display='flex' gap={2} justifyContent='flex-end' mt={2}>
      <Button color='default' variant='text' onClick={onClose}>
        Скасувати
      </Button>
      <Button
        color='error'
        disabled={isSubmitting || isFetching}
        type='submit'
        variant='contained'
        onClick={onSubmit}
      >
        Видалити
      </Button>
    </Box>
  );

  const content = (
    <Typography sx={stylesRedlineTypography} variant='body1'>
      {message}
    </Typography>
  );

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={error}
      isFetching={isFetching}
      title={title}
      onClose={onClose}
    />
  );
}

export default DeleteConfirmModal;
