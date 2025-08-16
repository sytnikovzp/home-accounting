import Box from '@mui/material/Box';

import ViewDetailRow from '@/src/components/ViewDetails/ViewDetailRow';

import { stylesViewPageBox } from '@/src/styles';

function ViewDetails({ data }) {
  if (!data || data.length === 0) {
    return <div>*Немає даних*</div>;
  }

  return (
    <Box sx={stylesViewPageBox}>
      {data.map(
        ({ icon, label, value, isLink = false, linkTo = '', extra }) => (
          <ViewDetailRow
            key={label}
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
