import { Box, Typography } from '@mui/material';

import {
  stylesViewDetailRowBox,
  stylesViewDetailRowExtraBox,
  stylesViewDetailRowTypography,
} from '../../styles/components/viewDetails';

import ValueWithLink from './ValueWithLink';

function ViewDetailRow({ icon: Icon, label, value, isLink, linkTo, extra }) {
  return (
    <Box sx={stylesViewDetailRowExtraBox}>
      <Box sx={stylesViewDetailRowBox}>
        {Icon && <Icon color='primary' />}
        <Typography sx={stylesViewDetailRowTypography} variant='body1'>
          <strong>{label}: </strong>
          <ValueWithLink isLink={isLink} linkTo={linkTo} value={value} />
        </Typography>
      </Box>
      {extra && <Box>{extra}</Box>}
    </Box>
  );
}

export default ViewDetailRow;
