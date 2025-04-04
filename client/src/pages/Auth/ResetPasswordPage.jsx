import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useResetPasswordMutation } from '../../store/services';

import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ResetPasswordPage() {
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const [resetPassword, { isLoading: isSubmitting, error: submitError }] =
    useResetPasswordMutation();

  const error = submitError?.data;

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

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return responseData ? (
    <ModalWindow isOpen title={responseData.title} onClose={handleModalClose}>
      <Alert severity={responseData.severity}>{responseData.message}</Alert>
      <Box display='flex' justifyContent='center' mt={2}>
        <Button
          fullWidth
          color='success'
          variant='contained'
          onClick={handleModalClose}
        >
          Закрити
        </Button>
      </Box>
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
