import { useCallback, useEffect, useMemo, useState } from 'react';
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

const titles = {
  login: 'Авторизація',
  register: 'Реєстрація',
  forgotPassword: 'Відновлення паролю',
};

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

  const handleNavigateWithPayload = useCallback(
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
        handleNavigateWithPayload(
          authMode === 'forgotPassword' ? '/notification' : '/',
          result.data
        );
        handleModalClose();
      }
    },
    [authMode, handleModalClose, handleNavigateWithPayload]
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

  const actions = useMemo(() => {
    if (authMode === 'login') {
      return (
        <Button
          fullWidth
          color='secondary'
          variant='text'
          onClick={() => setAuthMode('register')}
        >
          Перейти до реєстрації
        </Button>
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

  const title = (
    <Box alignItems='center' display='flex' flexDirection='column'>
      <Avatar
        sx={{
          height: 50,
          mb: 1,
          mx: 'auto',
          width: 50,
          bgcolor: getAvatarBgColor,
        }}
      >
        <LockOutlinedIcon />
      </Avatar>
      <Typography sx={stylesAuthPageTitle} variant='h6'>
        {titles[authMode]}
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
