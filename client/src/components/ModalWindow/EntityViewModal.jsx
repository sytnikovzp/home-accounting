import { useMemo } from 'react';

import { Box, Divider, Typography } from '@mui/material';

import Preloader from '../../components/Preloader/Preloader';

import PermissionsList from '../ViewDetails/PermissionsList';
import ViewDetails from '../ViewDetails/ViewDetails';

import ModalWindow from './ModalWindow';

import { stylesViewPageBox } from '../../styles';

function EntityViewModal({
  data,
  error,
  isFetching,
  permissions,
  title,
  onClose,
}) {
  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
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
  }, [data, isFetching, permissions]);

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error}
      title={title}
      onClose={onClose}
    />
  );
}

export default EntityViewModal;
