import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import {
  useFetchRoleByUuidQuery,
  useRemoveRoleMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function RoleRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: role, isLoading: isFetching } = useFetchRoleByUuidQuery(uuid, {
    skip: !uuid,
  });

  const [removeRole, { isLoading: isRemoving, error: removeError }] =
    useRemoveRoleMutation();

  const handleDeleteRole = useCallback(async () => {
    if (!role?.uuid) {
      return;
    }
    const result = await removeRole(role.uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [role?.uuid, handleModalClose, removeRole]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isFetching || isRemoving}
        size='large'
        variant='contained'
        onClick={handleDeleteRole}
      >
        Видалити
      </Button>,
    ],
    [isFetching, isRemoving, handleDeleteRole]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити роль «{role?.title}»?
      </Typography>
    );
  }, [isFetching, role?.title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={removeError?.data}
      title='Видалення ролі...'
      onClose={handleModalClose}
    />
  );
}

export default RoleRemovePage;
