import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import restController from '../../api/rest/restController';

import CustomModal from '../../components/CustomModal/CustomModal';
import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';

function UserResetPasswordPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const [isOpen, setIsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

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
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton
      title='Скидання паролю...'
      content={<ChangePasswordForm onSubmit={handleSubmitResetPassword} />}
      error={errorMessage}
    />
  );
}

export default UserResetPasswordPage;
