import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

function DeleteConfirmation({ isOpen, onClose, onConfirm, error }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Підтвердження видалення</DialogTitle>
      <DialogContent>
        <Typography>Ви впевнені, що хочете видалити цей елемент?</Typography>
        {error && (
          <Typography color='error' sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Скасувати
        </Button>
        <Button onClick={onConfirm} color='error' variant='contained'>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmation;
