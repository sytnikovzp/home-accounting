import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useChangeUserPasswordMutation } from '../../store/services';

import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function UserChangePasswordPage({ handleModalClose }) {
  const { uuid } = useParams();

  const [changeUserPassword, { isLoading: isSubmitting, error: submitError }] =
    useChangeUserPasswordMutation();

  const handleSubmitUser = useCallback(
    async (values) => {
      const result = await changeUserPassword({ userUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [changeUserPassword, handleModalClose, uuid]
  );

  const content = useMemo(
    () => (
      <ChangePasswordForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitUser}
      />
    ),
    [handleSubmitUser, isSubmitting]
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError?.data}
      title='Зміна паролю...'
      onClose={handleModalClose}
    />
  );
}

export default UserChangePasswordPage;
