import { Button } from '@mui/material';

function ModalCloseButton({ onClick }) {
  return (
    <Button fullWidth color='success' variant='contained' onClick={onClick}>
      Закрити
    </Button>
  );
}

export default ModalCloseButton;
