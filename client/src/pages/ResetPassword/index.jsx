import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import { useResetPasswordMutation } from '@/src/store/services';

import ChangePasswordForm from '@/src/components/forms/ChangePasswordForm';
import ModalWindow from '@/src/components/ModalWindow';

function ResetPasswordPage() {
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const [resetPassword, { isLoading: isSubmitting, error: submitError }] =
    useResetPasswordMutation();

  const apiError = submitError?.data;

  const handleModalClose = useCallback(() => {
    setResponseData(null);
    navigate('/');
  }, [navigate]);

  const handleResetPassword = useCallback(
    async (values) => {
      const response = await resetPassword({ token, ...values });
      if (response?.data) {
        setResponseData({
          severity: response.data?.severity,
          title: response.data?.title,
          message: response.data?.message,
        });
      }
    },
    [resetPassword, token]
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

  return responseData ? (
    <ModalWindow
      isOpen
      showCloseButton
      title={responseData.title}
      onClose={handleModalClose}
    >
      <Alert severity={responseData.severity}>{responseData.message}</Alert>
    </ModalWindow>
  ) : (
    <ModalWindow isOpen title='Відновлення паролю' onClose={handleModalClose}>
      <ChangePasswordForm
        isSubmitting={isSubmitting}
        onSubmit={handleResetPassword}
      />
    </ModalWindow>
  );
}

export default ResetPasswordPage;
