import { Button } from '@mui/material';

function ModalDeleteButtons({ disabled, onCancel, onConfirm }) {
  return (
    <>
      <Button color='default' variant='text' onClick={onCancel}>
        Скасувати
      </Button>
      <Button
        color='error'
        disabled={disabled}
        variant='contained'
        onClick={onConfirm}
      >
        Видалити
      </Button>
    </>
  );
}

export default ModalDeleteButtons;
