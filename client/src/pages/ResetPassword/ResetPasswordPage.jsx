import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { pageTitles } from '../../constants';
import usePageTitle from '../../hooks/usePageTitle';
import { useResetPasswordMutation } from '../../store/services';

import ChangePasswordForm from '../../components/Forms/ChangePasswordForm/ChangePasswordForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

const { RESET_PASSWORD_TITLES } = pageTitles;

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const [resetPassword, { isLoading: isSubmitting, error: submitError }] =
    useResetPasswordMutation();

  const handleModalClose = () => {
    navigate('/');
  };

  usePageTitle(location, RESET_PASSWORD_TITLES);

  const handleSubmitPassword = useCallback(
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
        onSubmit={handleSubmitPassword}
      />
    ),
    [handleSubmitPassword, isSubmitting]
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError?.data}
      title='Скидання паролю...'
      onClose={handleModalClose}
    />
  );
}

export default ResetPasswordPage;
