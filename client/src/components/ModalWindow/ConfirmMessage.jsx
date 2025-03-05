import Typography from '@mui/material/Typography';

import { stylesRedlineTypography } from '../../styles';

function ConfirmMessage({ children }) {
  return (
    <Typography sx={stylesRedlineTypography} variant='body1'>
      {children}
    </Typography>
  );
}

export default ConfirmMessage;
