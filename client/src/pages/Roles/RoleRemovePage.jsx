import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchRoleByUuidQuery,
  useRemoveRoleMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';

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

  const message = `Ви впевнені, що хочете видалити роль «${title}»?`;

  return (
    <DeleteConfirmModal
      error={error}
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
