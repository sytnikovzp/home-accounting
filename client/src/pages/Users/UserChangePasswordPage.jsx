import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAuthUser from '../../hooks/useAuthUser';

import {
  useChangeUserPasswordMutation,
  useChangeUserProfilePasswordMutation,
} from '../../store/services';

import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function UserChangePasswordPage() {
  const { uuid } = useParams();
  const { authenticatedUser } = useAuthUser();
  const navigate = useNavigate();

  const isAuthenticatedUser = !uuid || uuid === authenticatedUser?.uuid;

  const [
    changeUserPassword,
    { isLoading: isUserPasswordSubmitting, error: submitUserPasswordError },
  ] = useChangeUserPasswordMutation();
  const [
    changeUserProfilePassword,
    {
      isLoading: isUserProfilePasswordSubmitting,
      error: submitUserProfilePasswordError,
    },
  ] = useChangeUserProfilePasswordMutation();

  const isChangingPassword =
    isUserPasswordSubmitting || isUserProfilePasswordSubmitting;
  const error = submitUserPasswordError || submitUserProfilePasswordError;

  const handleModalClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSubmitPassword = useCallback(
    async (values) => {
      const action = isAuthenticatedUser
        ? changeUserProfilePassword
        : changeUserPassword;
      const payload = isAuthenticatedUser
        ? values
        : { userUuid: uuid, ...values };
      const result = await action(payload);
      if (result?.data) {
        handleModalClose();
      }
    },
    [
      changeUserPassword,
      changeUserProfilePassword,
      handleModalClose,
      isAuthenticatedUser,
      uuid,
    ]
  );

  const content = (
    <ChangePasswordForm
      isSubmitting={isChangingPassword}
      onSubmit={handleSubmitPassword}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error}
      title='Зміна паролю'
      onClose={handleModalClose}
    />
  );
}

export default UserChangePasswordPage;
