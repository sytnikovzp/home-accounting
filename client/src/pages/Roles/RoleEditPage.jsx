import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useEditRoleMutation,
  useFetchRoleByUuidQuery,
} from '@/src/store/services';

import RoleForm from '@/src/components/_forms/RoleForm/RoleForm';
import ModalWindow from '@/src/components/ModalWindow/ModalWindow';

function RoleEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: roleData,
    isFetching,
    error: fetchError,
  } = useFetchRoleByUuidQuery(uuid, { skip: !uuid });

  const [editRole, { isLoading: isSubmitting, error: submitError }] =
    useEditRoleMutation();

  const apiError = fetchError?.data || submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await editRole({ roleUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editRole, handleModalClose, uuid]
  );

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
      isFetching={isFetching}
      title='Редагування ролі'
      onClose={handleModalClose}
    >
      <RoleForm
        isSubmitting={isSubmitting}
        role={roleData}
        onSubmit={handleSubmit}
      />
    </ModalWindow>
  );
}

export default RoleEditPage;
