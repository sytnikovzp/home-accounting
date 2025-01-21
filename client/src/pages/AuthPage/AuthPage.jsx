import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

import { pageTitles } from '../../constants';
import usePageTitle from '../../hooks/usePageTitle';

import {
  selectAuthError,
  selectAuthIsLoading,
} from '../../store/selectors/authSelectors';
import {
  forgotPasswordThunk,
  loginThunk,
  registrationThunk,
} from '../../store/thunks/authThunks';

import ForgotPasswordForm from '../../components/Forms/ForgotPasswordForm/ForgotPasswordForm';
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import RegistrationForm from '../../components/Forms/RegistrationForm/RegistrationForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

import { stylesAuthPageAvatar, stylesAuthPageTitle } from '../../styles';

const { AUTH_TITLES } = pageTitles;

function AuthPage({ isOpen, onClose }) {
  const [authMode, setAuthMode] = useState('login');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const errorMessage = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthIsLoading);

  usePageTitle(location, AUTH_TITLES, authMode);

  const handleAuth = async (action, args) => {
    const resultAction = await dispatch(action(args));
    if (
      action === forgotPasswordThunk &&
      resultAction.meta.requestStatus === 'fulfilled'
    ) {
      onClose();
      const { severity, title, message } = resultAction.payload;
      navigate(
        `/notification?severity=${encodeURIComponent(
          severity
        )}&title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}`
      );
      return;
    }

    if (resultAction.meta.requestStatus === 'fulfilled') {
      onClose();
      navigate('/');
    }
  };

  const toggleAuthMode = (mode) => setAuthMode(mode);

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

  const renderContent = () => {
    switch (authMode) {
      case 'login':
        return (
          <>
            <LoginForm
              isLoading={isLoading}
              onSubmit={({ email, password }) =>
                handleAuth(loginThunk, { email, password })
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
            isLoading={isLoading}
            onSubmit={({ fullName, email, password }) =>
              handleAuth(registrationThunk, { fullName, email, password })
            }
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordForm
            isLoading={isLoading}
            onSubmit={({ email }) => handleAuth(forgotPasswordThunk, { email })}
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
    <ModalWindow
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
