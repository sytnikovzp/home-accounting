import { Box } from '@mui/material';

import ViewDetailRow from './ViewDetailRow';

import { stylesViewPageBox } from '../../styles';

function ViewDetails({ data }) {
  if (!data || data.length === 0) {
    return <div>*Немає даних*</div>;
  }

  return (
    <Box sx={stylesViewPageBox}>
      {data.map(
        ({ icon, label, value, isLink = false, linkTo = '', extra }, index) => (
          <ViewDetailRow
            key={index}
            extra={extra}
            icon={icon}
            isLink={isLink}
            label={label}
            linkTo={linkTo}
            value={value}
          />
        )
      )}
    </Box>
  );
}

export default ViewDetails;
