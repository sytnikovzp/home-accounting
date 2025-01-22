import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import restController from '../../api/rest/restController';

import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function UserResetPasswordPage() {
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const handleSubmitResetPassword = async (values) => {
    setError(null);
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
      setError(error.response.data);
    }
  };

  const handleModalOpen = () => {
    navigate('/');
  };

  return (
    <ModalWindow
      isOpen
      content={<ChangePasswordForm onSubmit={handleSubmitResetPassword} />}
      error={error}
      title='Скидання паролю...'
      onClose={handleModalOpen}
    />
  );
}

export default UserResetPasswordPage;
