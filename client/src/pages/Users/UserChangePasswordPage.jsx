import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

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
  const error =
    submitUserPasswordError?.data || submitUserProfilePasswordError?.data;

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

  if (error) {
    return (
      <ModalWindow
        isOpen
        actionsOnCenter={
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        }
        title={error.title}
        onClose={handleModalClose}
      >
        <Alert severity={error.severity}>{error.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Зміна паролю' onClose={handleModalClose}>
      <ChangePasswordForm
        isSubmitting={isChangingPassword}
        onSubmit={handleSubmitPassword}
      />
    </ModalWindow>
  );
}

export default UserChangePasswordPage;
