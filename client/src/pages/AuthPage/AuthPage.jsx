import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// ==============================================================
import { Box, Typography, Button, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// ==============================================================
import restController from '../../api/rest/restController';
// ==============================================================
import { stylesAuthTitle, stylesAuthAvatar } from '../../styles/theme';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import RegistrationForm from '../../components/Forms/RegistrationForm/RegistrationForm';

function AuthPage({ isOpen, onClose, checkAuthentication }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const errorMessages = {
    login: 'Авторизація неуспішна. Перевірте облікові дані.',
    registration: 'Реєстрація неуспішна. Спробуйте знову.',
  };

  const handleAuth = useCallback(
    async (authMethod, ...args) => {
      try {
        setErrorMessage(null);
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

  const toggleAuthMode = () => {
    setErrorMessage(null);
    setIsLoginMode((prev) => !prev);
  };

  const renderTitle = (isLoginMode) => (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Avatar
        sx={{
          ...stylesAuthAvatar,
          bgcolor: isLoginMode ? 'success.light' : 'success.main',
        }}
      >
        <LockOutlinedIcon />
      </Avatar>
      <Typography variant='h6' sx={stylesAuthTitle}>
        {isLoginMode ? 'Авторизація' : 'Реєстрація'}
      </Typography>
    </Box>
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
    <Button onClick={toggleAuthMode} variant='text' color='secondary' fullWidth>
      {isLoginMode ? 'Перейти до реєстрації' : 'Перейти до авторизації'}
    </Button>
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
      title={renderTitle(isLoginMode)}
      content={content}
      actions={actions}
      error={errorMessage}
    />
  );
}

export default AuthPage;
