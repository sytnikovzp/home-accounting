import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  error,
  isErrorMode,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {isErrorMode ? 'Помилка' : 'Підтвердження видалення'}
      </DialogTitle>
      <DialogContent>
        {error ? (
          <Typography color='error'>{error}</Typography>
        ) : (
          <Typography>Ви впевнені, що хочете видалити цей елемент?</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          {isErrorMode ? 'OK' : 'Скасувати'}
        </Button>
        {!isErrorMode && (
          <Button onClick={onConfirm} color='error' variant='contained'>
            Видалити
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmation;
