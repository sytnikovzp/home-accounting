import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForgotPasswordMutation } from '../../store/services';

import ForgotPasswordForm from '../../components/Forms/ForgotPasswordForm/ForgotPasswordForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ForgotPassword() {
  const navigate = useNavigate();
  const [infoModalData, setInfoModalData] = useState(null);

  const [forgotPassword, { isLoading: isSubmitting, error: submitError }] =
    useForgotPasswordMutation();

  const handleModalClose = useCallback(() => {
    setInfoModalData(null);
    navigate('/');
  }, [navigate]);

  const handleForgotPassword = useCallback(
    async (values) => {
      const result = await forgotPassword(values);
      if (result?.data) {
        setInfoModalData({
          title: result.data?.title,
          message: result.data?.message,
          severity: result.data?.severity,
        });
      }
    },
    [forgotPassword]
  );

  if (submitError) {
    return (
      <InfoModal
        isOpen
        message={submitError.data?.message}
        severity={submitError.data?.severity}
        title={submitError.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return infoModalData ? (
    <InfoModal
      isOpen
      message={infoModalData.message}
      severity={infoModalData.severity}
      title={infoModalData.title}
      onClose={handleModalClose}
    />
  ) : (
    <ModalWindow
      isOpen
      content={
        <ForgotPasswordForm
          isSubmitting={isSubmitting}
          onSubmit={handleForgotPassword}
        />
      }
      title='Відновлення паролю'
      onClose={handleModalClose}
    />
  );
}

export default ForgotPassword;
