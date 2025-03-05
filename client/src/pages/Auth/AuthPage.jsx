import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert } from '@mui/material';
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
import ModalActions from '../../components/ModalWindow/ModalActions';
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
  const [infoModalData, setInfoModalData] = useState(null);
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

  const error =
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
      const result = await action(args);
      if (result?.data) {
        if (authMode === 'forgotPassword') {
          setInfoModalData({
            severity: result.data?.severity,
            title: result.data?.title,
            message: result.data?.message,
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

  const authForms = {
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

  const actions = (
    <Button fullWidth color='secondary' variant='text' onClick={toggleAuthMode}>
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

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return infoModalData ? (
    <ModalWindow isOpen title={infoModalData.title} onClose={handleModalClose}>
      <Alert severity={infoModalData.severity}>{infoModalData.message}</Alert>
      <Box display='flex' justifyContent='center' mt={2}>
        <Button
          fullWidth
          color='success'
          variant='contained'
          onClick={handleModalClose}
        >
          Закрити
        </Button>
      </Box>
    </ModalWindow>
  ) : (
    <ModalWindow isOpen title={title} onClose={handleModalClose}>
      {authForms[authMode]}
      <ModalActions>{actions}</ModalActions>
    </ModalWindow>
  );
}

export default AuthPage;
