import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Typography } from '@mui/material';

import {
  stylesViewDetailRowContainerStyles,
  stylesViewDetailRowTextStyles,
} from '../../styles';

function ViewDetailRow({ icon: Icon, label, value, linkTo }) {
  return (
    <Box sx={stylesViewDetailRowContainerStyles}>
      <Icon color='primary' />
      <Typography sx={stylesViewDetailRowTextStyles} variant='body1'>
        <strong>{label}: </strong>
        {linkTo ? (
          <Link
            color='primary'
            component={RouterLink}
            to={linkTo}
            underline='hover'
          >
            {value}
          </Link>
        ) : (
          value || '*Дані відсутні*'
        )}
      </Typography>
    </Box>
  );
}

export default ViewDetailRow;
