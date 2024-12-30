import { Alert } from '@mui/material';

function InfoMessage({ severity = 'info', message }) {
  return <Alert severity={severity}>{message}</Alert>;
}

export default InfoMessage;