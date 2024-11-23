import { Button, Typography } from '@mui/material';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';

function DeleteConfirmation({ isOpen, onClose, onConfirm }) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      modalType='dialog'
      title='Видалення елемента'
      content={
        <Typography>Ви впевнені, що хочете видалити цей елемент?</Typography>
      }
      actions={
        <>
          <Button onClick={onClose} color='inherit'>
            Скасувати
          </Button>
          <Button onClick={onConfirm} color='error' variant='contained'>
            Видалити
          </Button>
        </>
      }
    />
  );
}

export default DeleteConfirmation;
