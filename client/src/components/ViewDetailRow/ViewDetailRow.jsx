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
      <Typography variant='body1' sx={stylesViewDetailRowTextStyles}>
        <strong>{label}: </strong>
        {linkTo ? (
          <Link
            component={RouterLink}
            to={linkTo}
            color='primary'
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
