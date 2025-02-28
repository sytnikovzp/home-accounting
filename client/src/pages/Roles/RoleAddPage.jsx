import { useCallback, useMemo } from 'react';

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

  const content = useMemo(
    () => <RoleForm isSubmitting={isSubmitting} onSubmit={handleSubmitRole} />,
    [handleSubmitRole, isSubmitting]
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError?.data}
      title='Додавання ролі'
      onClose={handleModalClose}
    />
  );
}

export default RoleAddPage;
