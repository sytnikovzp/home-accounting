import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useResetPasswordMutation } from '../../store/services';

import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ResetPasswordPage() {
  const [infoModalData, setInfoModalData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const [resetPassword, { isLoading: isSubmitting, error: submitError }] =
    useResetPasswordMutation();

  const handleModalClose = useCallback(() => {
    setInfoModalData(null);
    navigate('/');
  }, [navigate]);

  const handleResetPassword = useCallback(
    async (values) => {
      const result = await resetPassword({ token, ...values });
      if (result?.data) {
        setInfoModalData({
          severity: result.data?.severity,
          title: result.data?.title,
          message: result.data?.message,
        });
      }
    },
    [resetPassword, token]
  );

  const content = (
    <ChangePasswordForm
      isSubmitting={isSubmitting}
      onSubmit={handleResetPassword}
    />
  );

  return infoModalData ? (
    <InfoModal
      message={infoModalData.message}
      severity={infoModalData.severity}
      title={infoModalData.title}
      onClose={handleModalClose}
    />
  ) : (
    <ModalWindow
      isOpen
      content={content}
      error={submitError}
      title='Відновлення паролю'
      onClose={handleModalClose}
    />
  );
}

export default ResetPasswordPage;
