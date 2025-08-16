import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useFetchRoleByUuidQuery,
  useRemoveRoleMutation,
} from '@/src/store/services';

import ModalWindow from '@/src/components/ModalWindow';

function RoleRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: roleData,
    isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const [removeRole, { isLoading: isRemoving, error: removeError }] =
    useRemoveRoleMutation();

  const apiError = fetchError?.data || removeError?.data;

  const confirmMessage = `Ви впевнені, що хочете видалити роль «${roleData?.title}»?`;

  const handleRemove = useCallback(async () => {
    const response = await removeRole(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeRole]);

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      showDeleteButtons
      deleteButtonDisabled={isRemoving || isFetching}
      deleteConfirmMessage={confirmMessage}
      isFetching={isFetching}
      title='Видалення ролі'
      onClose={handleModalClose}
      onDelete={handleRemove}
    />
  );
}

export default RoleRemovePage;
