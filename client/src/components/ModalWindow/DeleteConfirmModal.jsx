import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import ModalWindow from './ModalWindow';

function DeleteConfirmModal({
  isFetching,
  isSubmitting,
  content,
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

export default DeleteConfirmModal;
