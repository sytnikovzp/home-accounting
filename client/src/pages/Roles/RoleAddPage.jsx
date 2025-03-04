import { useCallback } from 'react';

import { useAddRoleMutation } from '../../store/services';

import RoleForm from '../../components/Forms/RoleForm/RoleForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function RoleAddPage({ handleModalClose }) {
  const [addRole, { isLoading: isSubmitting, error: submitError }] =
    useAddRoleMutation();

  const handleSubmitRole = useCallback(
    async (values) => {
      const result = await addRole(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addRole, handleModalClose]
  );

  const content = (
    <RoleForm isSubmitting={isSubmitting} onSubmit={handleSubmitRole} />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError}
      title='Додавання ролі'
      onClose={handleModalClose}
    />
  );
}

export default RoleAddPage;
