import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useResetPasswordMutation } from '../../store/services';

import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const [resetPassword, { isLoading: isSubmitting, error: submitError }] =
    useResetPasswordMutation();

  const handleModalClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleResetPassword = useCallback(
    async (values) => {
      const result = await resetPassword({ token, ...values });
      if (result?.data) {
        navigate(
          `/notification?severity=${encodeURIComponent(
            result.data.severity
          )}&title=${encodeURIComponent(
            result.data.title
          )}&message=${encodeURIComponent(result.data.message)}`
        );
      }
    },
    [resetPassword, token, navigate]
  );

  const content = useMemo(
    () => (
      <ChangePasswordForm
        isSubmitting={isSubmitting}
        onSubmit={handleResetPassword}
      />
    ),
    [handleResetPassword, isSubmitting]
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError?.data}
      title='Відновлення паролю...'
      onClose={handleModalClose}
    />
  );
}

export default ResetPassword;
