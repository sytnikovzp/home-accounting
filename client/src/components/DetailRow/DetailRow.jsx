import {  Link as RouterLink } from 'react-router-dom';
// ==============================================================
import {
  stylesRowContainerStyles,
  stylesViewTextStyles,
} from '../../styles/theme';
// ==============================================================
import {
  Box,
  Typography,
  Link,
} from '@mui/material';

const DetailRow = ({ icon: Icon, label, value, linkTo }) => (
  <Box sx={stylesRowContainerStyles}>
    <Icon color='primary' />
    <Typography variant='body1' sx={stylesViewTextStyles}>
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

export default DetailRow