import { useCallback } from 'react';

import Alert from '@mui/material/Alert';

import { useAddRoleMutation } from '@/src/store/services';

import RoleForm from '@/src/components/_forms/RoleForm/RoleForm';
import ModalWindow from '@/src/components/ModalWindow/ModalWindow';

function RoleAddPage({ handleModalClose }) {
  const [addRole, { isLoading: isSubmitting, error: submitError }] =
    useAddRoleMutation();

  const apiError = submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await addRole(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addRole, handleModalClose]
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
    <ModalWindow isOpen title='Додавання ролі' onClose={handleModalClose}>
      <RoleForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </ModalWindow>
  );
}

export default RoleAddPage;
