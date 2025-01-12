import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import restController from '../../api/rest/restController';

import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function UserResetPasswordPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const handleSubmitResetPassword = async (values) => {
    setErrorMessage(null);
    try {
      const response = await restController.resetPassword(
        token,
        values.newPassword,
        values.confirmNewPassword
      );
      navigate(
        `/notification?severity=${encodeURIComponent(
          response.severity
        )}&title=${encodeURIComponent(
          response.title
        )}&message=${encodeURIComponent(response.message)}`
      );
    } catch (error) {
      setErrorMessage(error.response.data);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <ModalWindow
      showCloseButton
      content={<ChangePasswordForm onSubmit={handleSubmitResetPassword} />}
      error={errorMessage}
      isOpen={isOpen}
      title='Скидання паролю...'
      onClose={handleClose}
    />
  );
}

export default UserResetPasswordPage;
