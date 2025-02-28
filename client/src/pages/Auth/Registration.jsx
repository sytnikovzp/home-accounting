import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRegistrationMutation } from '../../store/services';

import RegistrationForm from '../../components/Forms/RegistrationForm/RegistrationForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function Registration() {
  const navigate = useNavigate();

  const [registration, { isLoading: isSubmitting, error: submitError }] =
    useRegistrationMutation();

  const handleModalClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleRegistration = useCallback(
    async (values) => {
      const result = await registration(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [registration, handleModalClose]
  );

  const content = useMemo(
    () => (
      <RegistrationForm
        isSubmitting={isSubmitting}
        onSubmit={handleRegistration}
      />
    ),
    [handleRegistration, isSubmitting]
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError?.data}
      title='Реєстрація користувача'
      onClose={handleModalClose}
    />
  );
}

export default Registration;
