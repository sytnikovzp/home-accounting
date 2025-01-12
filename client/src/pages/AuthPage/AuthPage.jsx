import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

import restController from '../../api/rest/restController';

import CustomModal from '../../components/CustomModal/CustomModal';
import ForgotPasswordForm from '../../components/Forms/ForgotPasswordForm/ForgotPasswordForm';
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import RegistrationForm from '../../components/Forms/RegistrationForm/RegistrationForm';

import { stylesAuthPageAvatar, stylesAuthPageTitle } from '../../styles';

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
      <Box alignItems='center' display='flex' flexDirection='column'>
        <Avatar
          sx={{
            ...stylesAuthPageAvatar,
            bgcolor: (() => {
              switch (authMode) {
                case 'login':
                  return 'success.light';
                case 'register':
                  return 'success.main';
                default:
                  return 'warning.main';
              }
            })(),
          }}
        >
          <LockOutlined />
        </Avatar>
        <Typography sx={stylesAuthPageTitle} variant='h6'>
          {titles[authMode]}
        </Typography>
      </Box>
    );
  };

  useEffect(() => {
    const pageTitles = {
      login: 'Авторизація | Моя бухгалтерія',
      register: 'Реєстрація | Моя бухгалтерія',
      forgotPassword: 'Відновлення паролю | Моя бухгалтерія',
    };

    document.title = pageTitles[authMode];
  }, [authMode]);

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
              fullWidth
              color='secondary'
              sx={{ mt: 2 }}
              variant='text'
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

  const renderActionButton = () => {
    if (authMode === 'forgotPassword') {
      return (
        <Button
          fullWidth
          color='secondary'
          variant='text'
          onClick={() => toggleAuthMode('login')}
        >
          Повернутися до авторизації
        </Button>
      );
    }

    return (
      <Button
        fullWidth
        color='secondary'
        variant='text'
        onClick={() =>
          toggleAuthMode(authMode === 'login' ? 'register' : 'login')
        }
      >
        {authMode === 'login'
          ? 'Перейти до реєстрації'
          : 'Перейти до авторизації'}
      </Button>
    );
  };

  return (
    <CustomModal
      actions={renderActionButton()}
      content={renderContent()}
      error={errorMessage}
      isOpen={isOpen}
      title={renderTitle()}
      onClose={() => {
        onClose();
        navigate('/');
      }}
    />
  );
}

export default AuthPage;
