import { Alert } from '@mui/material';

function InfoMessage({ type = 'info', message }) {
  return <Alert severity={type}>{message}</Alert>;
}

export default InfoMessage;
