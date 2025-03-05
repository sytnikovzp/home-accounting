import { Box, Divider, Typography } from '@mui/material';

import PermissionsList from '../ViewDetails/PermissionsList';
import ViewDetails from '../ViewDetails/ViewDetails';

import ModalWindow from './ModalWindow';

import { stylesViewPageBox } from '../../styles';

function EntityViewModal({ data, isFetching, permissions, title, onClose }) {
  const content = (
    <Box sx={stylesViewPageBox}>
      <ViewDetails data={data} />
      {permissions && (
        <>
          <Divider />
          <Typography variant='h6'>Права доступу:</Typography>
          <PermissionsList permissions={permissions} />
        </>
      )}
    </Box>
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      isFetching={isFetching}
      title={title}
      onClose={onClose}
    />
  );
}

export default EntityViewModal;
