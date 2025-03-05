import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Typography } from '@mui/material';

import {
  useFetchRoleByUuidQuery,
  useRemoveRoleMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';
import InfoModal from '../../components/ModalWindow/InfoModal';
import Preloader from '../../components/Preloader/Preloader';

import { stylesRedlineTypography } from '../../styles';

function RoleRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: role,
    isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const { title } = role ?? {};

  const [removeRole, { isLoading: isRemoving, error: removeError }] =
    useRemoveRoleMutation();

  const error = fetchError || removeError;

  const handleRemoveRole = useCallback(async () => {
    const result = await removeRole(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeRole]);

  const content = isFetching ? (
    <Preloader />
  ) : (
    <Typography sx={stylesRedlineTypography} variant='body1'>
      Ви впевнені, що хочете видалити роль «{title}»?
    </Typography>
  );

  if (error) {
    return (
      <InfoModal
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <DeleteConfirmModal
      content={content}
      isFetching={isFetching}
      isSubmitting={isRemoving}
      title='Видалення ролі'
      onClose={handleModalClose}
      onSubmit={handleRemoveRole}
    />
  );
}

export default RoleRemovePage;
