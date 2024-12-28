import { useState, useCallback } from 'react';
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
import ForgotPasswordForm from '../../components/Forms/ForgotPasswordForm/ForgotPasswordForm';
import RegistrationForm from '../../components/Forms/RegistrationForm/RegistrationForm';

function AuthPage({ isOpen, onClose, checkAuthentication }) {
  const [authMode, setAuthMode] = useState('login');
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleAuth = useCallback(
    async (authMethod, ...args) => {
      setErrorMessage(null);
      try {
        const response = await authMethod(...args);
        if (authMethod === restController.forgotPassword) {
          onClose();
          navigate(
            `/notification?severity=${encodeURIComponent(
              response.severity
            )}&title=${encodeURIComponent(
              response.title
            )}&message=${encodeURIComponent(response.message)}`
          );
          return;
        }
        checkAuthentication();
        onClose();
        navigate('/');
      } catch (error) {
        setErrorMessage(error.response.data);
      }
    },
    [checkAuthentication, navigate, onClose]
  );

  const toggleAuthMode = (mode) => {
    setErrorMessage(null);
    setAuthMode(mode);
  };

  const renderTitle = () => {
    const titles = {
      login: 'Авторизація',
      register: 'Реєстрація',
      forgotPassword: 'Відновлення паролю',
    };

    return (
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Avatar
          sx={{
            ...stylesAuthAvatar,
            bgcolor:
              authMode === 'login'
                ? 'success.light'
                : authMode === 'register'
                ? 'success.main'
                : 'warning.main',
          }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h6' sx={stylesAuthTitle}>
          {titles[authMode]}
        </Typography>
      </Box>
    );
  };

  const renderContent = () => {
    switch (authMode) {
      case 'login':
        return (
          <>
            <LoginForm
              onSubmit={({ email, password }) =>
                handleAuth(restController.login, email, password)
              }
            />
            <Button
              variant='text'
              color='secondary'
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => toggleAuthMode('forgotPassword')}
            >
              Забули пароль?
            </Button>
          </>
        );
      case 'register':
        return (
          <RegistrationForm
            onSubmit={({ fullName, email, password }) =>
              handleAuth(restController.registration, fullName, email, password)
            }
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordForm
            onSubmit={({ email }) =>
              handleAuth(restController.forgotPassword, email)
            }
          />
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    if (authMode === 'forgotPassword') {
      return (
        <Button
          onClick={() => toggleAuthMode('login')}
          variant='text'
          color='secondary'
          fullWidth
        >
          Повернутися до авторизації
        </Button>
      );
    }

    return (
      <Button
        onClick={() =>
          toggleAuthMode(authMode === 'login' ? 'register' : 'login')
        }
        variant='text'
        color='secondary'
        fullWidth
      >
        {authMode === 'login'
          ? 'Перейти до реєстрації'
          : 'Перейти до авторизації'}
      </Button>
    );
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        navigate('/');
      }}
      title={renderTitle()}
      content={renderContent()}
      actions={renderActions()}
      error={errorMessage}
    />
  );
}

export default AuthPage;
