import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import {
  useForgotPasswordMutation,
  useLoginMutation,
  useRegistrationMutation,
} from '../../store/services';

import ForgotPasswordForm from '../../components/Forms/ForgotPasswordForm/ForgotPasswordForm';
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import RegistrationForm from '../../components/Forms/RegistrationForm/RegistrationForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

import { stylesAuthPageBoxTitle, stylesAuthPageTitle } from '../../styles';

const TITLES = {
  login: 'Авторизація',
  registration: 'Реєстрація',
  forgotPassword: 'Відновлення паролю',
};

const AVATAR_COLORS = {
  login: 'success.light',
  registration: 'success.main',
  forgotPassword: 'warning.main',
};

function AuthPage() {
  const [authMode, setAuthMode] = useState('login');
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();

  const [
    login,
    { isLoading: isLoggingIn, error: loginError, reset: resetLogin },
  ] = useLoginMutation();
  const [
    registration,
    {
      isLoading: isRegistration,
      error: registrationError,
      reset: resetRegistration,
    },
  ] = useRegistrationMutation();
  const [
    forgotPassword,
    {
      isLoading: isResetting,
      error: forgotPasswordError,
      reset: resetForgotPassword,
    },
  ] = useForgotPasswordMutation();

  const apiError =
    loginError?.data || registrationError?.data || forgotPasswordError?.data;

  useEffect(() => {
    if (authMode === 'login') {
      resetRegistration();
      resetForgotPassword();
    }
    if (authMode === 'registration') {
      resetLogin();
      resetForgotPassword();
    }
    if (authMode === 'forgotPassword') {
      resetLogin();
      resetRegistration();
    }
  }, [authMode, resetForgotPassword, resetLogin, resetRegistration]);

  const handleModalClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleAuth = useCallback(
    async (action, args) => {
      const response = await action(args);
      if (response?.data) {
        if (authMode === 'forgotPassword') {
          setResponseData({
            severity: response.data?.severity,
            title: response.data?.title,
            message: response.data?.message,
          });
        } else {
          handleModalClose();
        }
      }
    },
    [authMode, handleModalClose]
  );

  const handleSubmit = useCallback(
    (action) => async (data) => {
      await handleAuth(action, data);
    },
    [handleAuth]
  );

  const toggleAuthMode = useCallback(() => {
    setAuthMode((prevMode) => {
      if (prevMode === 'login') {
        return 'registration';
      }
      return 'login';
    });
  }, []);

  const renderAuthForms = {
    login: (
      <>
        <LoginForm isSubmitting={isLoggingIn} onSubmit={handleSubmit(login)} />
        <Button
          fullWidth
          color='secondary'
          sx={{ mt: 2 }}
          variant='text'
          onClick={() => setAuthMode('forgotPassword')}
        >
          Забули пароль?
        </Button>
      </>
    ),
    registration: (
      <RegistrationForm
        isSubmitting={isRegistration}
        onSubmit={handleSubmit(registration)}
      />
    ),
    forgotPassword: (
      <ForgotPasswordForm
        isSubmitting={isResetting}
        onSubmit={handleSubmit(forgotPassword)}
      />
    ),
  };

  const renderTitle = (
    <Box sx={stylesAuthPageBoxTitle}>
      <Avatar
        sx={{
          width: 50,
          height: 50,
          mb: 1,
          mx: 'auto',
          bgcolor: AVATAR_COLORS[authMode],
        }}
      >
        <LockOutlinedIcon />
      </Avatar>
      <Typography sx={stylesAuthPageTitle} variant='h6'>
        {TITLES[authMode]}
      </Typography>
    </Box>
  );

  const renderAuthModeButton = (
    <Button fullWidth color='secondary' variant='text' onClick={toggleAuthMode}>
      {authMode === 'login'
        ? 'Перейти до реєстрації'
        : 'Повернутися до авторизації'}
    </Button>
  );

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return responseData ? (
    <ModalWindow
      isOpen
      showCloseButton
      title={responseData.title}
      onClose={handleModalClose}
    >
      <Alert severity={responseData.severity}>{responseData.message}</Alert>
    </ModalWindow>
  ) : (
    <ModalWindow
      isOpen
      actionsOnCenter={renderAuthModeButton}
      title={renderTitle}
      onClose={handleModalClose}
    >
      {renderAuthForms[authMode]}
    </ModalWindow>
  );
}

export default AuthPage;
