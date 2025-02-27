import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Preloader from '../../components/Preloader/Preloader';

import ModalWindow from './ModalWindow';

import { stylesRedlineTypography } from '../../styles';

function ConfirmModal({
  isOpen,
  isFetching,
  isLoading,
  message,
  title,
  onClose,
  onConfirm,
}) {
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
      actions={
        <Box display='flex' gap={2} justifyContent='flex-end' mt={2}>
          <Button
            color='default'
            disabled={isLoading || isFetching}
            variant='text'
            onClick={onClose}
          >
            Скасувати
          </Button>
          <Button
            color='error'
            disabled={isLoading || isFetching}
            variant='contained'
            onClick={onConfirm}
          >
            Видалити
          </Button>
        </Box>
      }
      content={content}
      isOpen={isOpen}
      title={title}
      onClose={onClose}
    />
  );
}

export default ConfirmModal;
