import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

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
  const apiError =
    submitUserPasswordError?.data || submitUserProfilePasswordError?.data;

  const handleModalClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (values) => {
      const action = isAuthenticatedUser
        ? changeUserProfilePassword
        : changeUserPassword;
      const payload = isAuthenticatedUser
        ? values
        : { userUuid: uuid, ...values };
      const response = await action(payload);
      if (response?.data) {
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
    <ModalWindow isOpen title='Зміна паролю' onClose={handleModalClose}>
      <ChangePasswordForm
        isSubmitting={isChangingPassword}
        onSubmit={handleSubmit}
      />
    </ModalWindow>
  );
}

export default UserChangePasswordPage;
