import { useCallback } from 'react';

import { useAddRoleMutation } from '../../store/services';

import RoleForm from '../../components/Forms/RoleForm/RoleForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
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

  if (submitError) {
    return (
      <InfoModal
        message={submitError.data?.message}
        severity={submitError.data?.severity}
        title={submitError.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      content={content}
      title='Додавання ролі'
      onClose={handleModalClose}
    />
  );
}

export default RoleAddPage;
