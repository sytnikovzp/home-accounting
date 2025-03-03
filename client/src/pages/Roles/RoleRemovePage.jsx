import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchRoleByUuidQuery,
  useRemoveRoleMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';
import InfoModal from '../../components/ModalWindow/InfoModal';

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

  if (error) {
    return (
      <InfoModal
        isOpen
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  const message = `Ви впевнені, що хочете видалити роль «${title}»?`;

  return (
    <DeleteConfirmModal
      isOpen
      isFetching={isFetching}
      isSubmitting={isRemoving}
      message={message}
      title='Видалення ролі'
      onClose={handleModalClose}
      onSubmit={handleRemoveRole}
    />
  );
}

export default RoleRemovePage;
