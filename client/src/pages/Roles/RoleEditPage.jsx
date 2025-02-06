import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditRoleMutation,
  useFetchRoleByUuidQuery,
} from '../../store/services';

import RoleForm from '../../components/Forms/RoleForm/RoleForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function RoleEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: role,
    isLoading: isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const [editRole, { isLoading: isSubmitting, error: submitError }] =
    useEditRoleMutation();

  const error = fetchError || submitError;

  const handleSubmitRole = useCallback(
    async (values) => {
      const result = await editRole({ roleUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editRole, handleModalClose, uuid]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <RoleForm
      isSubmitting={isSubmitting}
      role={role}
      onSubmit={handleSubmitRole}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Редагування ролі...'
      onClose={handleModalClose}
    />
  );
}

export default RoleEditPage;
