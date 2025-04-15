import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ValueWithLink from './ValueWithLink';

import {
  stylesViewDetailRowBox,
  stylesViewDetailRowExtraBox,
  stylesViewDetailRowTypography,
} from '../../styles';

function ViewDetailRow({ extra, icon: Icon, isLink, label, linkTo, value }) {
  return (
    <Box sx={stylesViewDetailRowExtraBox}>
      <Box sx={stylesViewDetailRowBox}>
        {Icon && <Icon color='primary' />}
        <Typography sx={stylesViewDetailRowTypography} variant='body1'>
          <strong>{label}: </strong>
          <ValueWithLink isLink={isLink} linkTo={linkTo} value={value} />
        </Typography>
      </Box>
      {extra && <>{extra}</>}
    </Box>
  );
}

export default ViewDetailRow;
