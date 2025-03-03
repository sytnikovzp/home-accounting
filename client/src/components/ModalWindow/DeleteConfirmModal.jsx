import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Preloader from '../Preloader/Preloader';

import ModalWindow from './ModalWindow';

import { stylesRedlineTypography } from '../../styles';

function DeleteConfirmModal({
  isOpen,
  isFetching,
  isSubmitting,
  message,
  title,
  onClose,
  onSubmit,
}) {
  const actions = useMemo(
    () => (
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
    ),
    [isFetching, isSubmitting, onClose, onSubmit]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    if (message) {
      return (
        <Typography sx={stylesRedlineTypography} variant='body1'>
          {message}
        </Typography>
      );
    }
    return null;
  }, [isFetching, message]);

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

export default DeleteConfirmModal;
