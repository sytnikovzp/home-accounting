import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

import { stylesAuthPageTitle } from '../../styles';

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

  const error = loginError || registrationError || forgotPasswordError;

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
      const result = await action(args);
      if (result?.data) {
        handleModalClose();
      }
    },
    [handleModalClose]
  );

  const authForms = {
    login: (
      <>
        <LoginForm
          isSubmitting={isLoggingIn}
          onSubmit={(data) => handleAuth(login, data)}
        />
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
        onSubmit={(data) => handleAuth(registration, data)}
      />
    ),
    forgotPassword: (
      <ForgotPasswordForm
        isSubmitting={isResetting}
        onSubmit={(data) => handleAuth(forgotPassword, data)}
      />
    ),
  };

  const actions = (
    <Button
      fullWidth
      color='secondary'
      variant='text'
      onClick={() =>
        setAuthMode(authMode === 'login' ? 'registration' : 'login')
      }
    >
      {authMode === 'login'
        ? 'Перейти до реєстрації'
        : 'Повернутися до авторизації'}
    </Button>
  );

  const title = (
    <Box alignItems='center' display='flex' flexDirection='column'>
      <Avatar
        sx={{
          height: 50,
          mb: 1,
          mx: 'auto',
          width: 50,
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

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={authForms[authMode]}
      error={error?.data}
      title={title}
      onClose={handleModalClose}
    />
  );
}

export default AuthPage;
