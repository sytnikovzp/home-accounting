import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

import { pageTitles } from '../../constants';
import usePageTitle from '../../hooks/usePageTitle';
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useRegistrationMutation,
} from '../../store/services';

import ForgotPasswordForm from '../../components/Forms/ForgotPasswordForm/ForgotPasswordForm';
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import RegistrationForm from '../../components/Forms/RegistrationForm/RegistrationForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

import { stylesAuthPageAvatar, stylesAuthPageTitle } from '../../styles';

const { AUTH_TITLES } = pageTitles;

function AuthPage() {
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();

  const [
    login,
    { isLoading: isLoggingIn, error: loginError, reset: resetLogin },
  ] = useLoginMutation();
  const [
    register,
    { isLoading: isRegistering, error: registerError, reset: resetRegister },
  ] = useRegistrationMutation();
  const [
    forgotPassword,
    {
      isLoading: isResetting,
      error: forgotPasswordError,
      reset: resetForgotPassword,
    },
  ] = useForgotPasswordMutation();

  const error = loginError || registerError || forgotPasswordError;

  usePageTitle(location, AUTH_TITLES, authMode);

  useEffect(() => {
    if (authMode === 'login') {
      resetRegister();
      resetForgotPassword();
    }
    if (authMode === 'register') {
      resetLogin();
      resetForgotPassword();
    }
    if (authMode === 'forgotPassword') {
      resetLogin();
      resetRegister();
    }
  }, [authMode, resetForgotPassword, resetLogin, resetRegister]);

  const handleModalClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const navigateWithPayload = useCallback(
    (path, payload = null) => {
      if (payload) {
        const query = new URLSearchParams(payload).toString();
        navigate(`${path}?${query}`);
      } else {
        navigate(path);
      }
    },
    [navigate]
  );

  const handleAuth = useCallback(
    async (action, args) => {
      const result = await action(args);
      if (result?.data) {
        navigateWithPayload(
          authMode === 'forgotPassword' ? '/notification' : '/',
          result.data
        );
        handleModalClose();
      }
    },
    [authMode, handleModalClose, navigateWithPayload]
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
    register: (
      <RegistrationForm
        isSubmitting={isRegistering}
        onSubmit={(data) => handleAuth(register, data)}
      />
    ),
    forgotPassword: (
      <ForgotPasswordForm
        isSubmitting={isResetting}
        onSubmit={(data) => handleAuth(forgotPassword, data)}
      />
    ),
  };

  const getAvatarBgColor = useMemo(() => {
    if (authMode === 'login') {
      return 'success.light';
    }
    if (authMode === 'register') {
      return 'success.main';
    }
    return 'warning.main';
  }, [authMode]);

  const renderTitle = (
    <Box alignItems='center' display='flex' flexDirection='column'>
      <Avatar sx={{ ...stylesAuthPageAvatar, bgcolor: getAvatarBgColor }}>
        <LockOutlined />
      </Avatar>
      <Typography sx={stylesAuthPageTitle} variant='h6'>
        {AUTH_TITLES[authMode]}
      </Typography>
    </Box>
  );

  const renderActionButton = useMemo(() => {
    if (authMode === 'login') {
      return (
        <Box>
          <Button
            fullWidth
            color='secondary'
            variant='text'
            onClick={() => setAuthMode('register')}
          >
            Перейти до реєстрації
          </Button>
        </Box>
      );
    }
    return (
      <Button
        fullWidth
        color='secondary'
        variant='text'
        onClick={() => setAuthMode('login')}
      >
        Повернутися до авторизації
      </Button>
    );
  }, [authMode]);

  return (
    <ModalWindow
      isOpen
      actions={renderActionButton}
      content={authForms[authMode]}
      error={error?.data}
      title={renderTitle}
      onClose={handleModalClose}
    />
  );
}

export default AuthPage;
