import { useMemo } from 'react';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Preloader from '../../components/Preloader/Preloader';

import ModalWindow from './ModalWindow';

import { stylesRedlineTypography } from '../../styles';

function ConfirmModal({
  isOpen,
  error,
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
    if (error) {
      return (
        <Alert severity={error?.severity || 'error'} sx={{ mb: 2 }}>
          <AlertTitle>{error?.title || 'Помилка'}:</AlertTitle>
          {error?.message || 'Виникла помилка'}
        </Alert>
      );
    }
    if (message) {
      return (
        <Typography sx={stylesRedlineTypography} variant='body1'>
          {message}
        </Typography>
      );
    }
    return null;
  }, [isFetching, error, message]);

  return (
    <ModalWindow
      actions={
        <Box
          display='flex'
          flexDirection='column'
          gap={2}
          justifyContent='center'
        >
          <Button
            fullWidth
            color='warning'
            disabled={isLoading || isFetching}
            variant='contained'
            onClick={onConfirm}
          >
            Видалити
          </Button>

          <Button
            fullWidth
            color='success'
            disabled={isLoading || isFetching}
            variant='contained'
            onClick={onClose}
          >
            Скасувати
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
