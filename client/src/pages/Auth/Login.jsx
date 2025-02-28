import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLoginMutation } from '../../store/services';

import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function Login() {
  const navigate = useNavigate();

  const [login, { isLoading: isSubmitting, error: submitError }] =
    useLoginMutation();

  const handleModalClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleLogin = useCallback(
    async (values) => {
      const result = await login(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [login, handleModalClose]
  );

  const content = useMemo(
    () => <LoginForm isSubmitting={isSubmitting} onSubmit={handleLogin} />,
    [handleLogin, isSubmitting]
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError?.data}
      title='Авторизація'
      onClose={handleModalClose}
    />
  );
}

export default Login;
