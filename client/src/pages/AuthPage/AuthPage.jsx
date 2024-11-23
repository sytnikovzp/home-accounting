import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import { stylesAuthBox, stylesErrorMessage } from '../../styles/theme';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';

function AuthPage({ isOpen, onClose, checkAuthentication }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const errorMessages = {
    login: 'Авторизація неуспішна. Перевірте облікові дані.',
    registration: 'Реєстрація неуспішна. Спробуйте знову.',
  };

  const toggleAuthMode = () => {
    setErrorMessage('');
    setIsLoginMode((prev) => !prev);
  };

  const handleAuth = useCallback(
    async (authMethod, ...args) => {
      try {
        setErrorMessage('');
        await authMethod(...args);
        checkAuthentication();
        onClose();
        navigate('/');
      } catch (error) {
        console.error(
          `${
            authMethod === restController.login ? 'Авторизація' : 'Реєстрація'
          } неуспішна:`,
          error.message
        );
        setErrorMessage(
          authMethod === restController.login
            ? errorMessages.login
            : errorMessages.registration
        );
      }
    },
    [
      checkAuthentication,
      errorMessages.login,
      errorMessages.registration,
      navigate,
      onClose,
    ]
  );

  const content = isLoginMode ? (
    <LoginForm
      onSubmit={({ email, password }) =>
        handleAuth(restController.login, email, password)
      }
    />
  ) : (
    <RegistrationForm
      onSubmit={({ fullName, email, password }) =>
        handleAuth(restController.registration, fullName, email, password)
      }
    />
  );

  const actions = (
    <Box sx={stylesAuthBox}>
      {errorMessage && (
        <Typography color='error' sx={stylesErrorMessage}>
          {errorMessage}
        </Typography>
      )}
      <Button
        onClick={toggleAuthMode}
        variant='text'
        color='secondary'
        fullWidth
      >
        {isLoginMode ? 'Перейти до реєстрації' : 'Перейти до авторизації'}
      </Button>
    </Box>
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        navigate('/');
      }}
      content={content}
      actions={actions}
    />
  );
}

export default AuthPage;
