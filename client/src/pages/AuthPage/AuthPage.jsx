import { useCallback, useMemo, useState } from 'react';
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
const TITLES = {
  login: 'Авторизація',
  register: 'Реєстрація',
  forgotPassword: 'Відновлення паролю',
};

function AuthPage({ isOpen, onClose }) {
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const errorMessage = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthIsLoading);

  usePageTitle(location, AUTH_TITLES, authMode);

  const handleCloseAndNavigate = useCallback(
    (path, payload = null) => {
      onClose();
      if (payload) {
        const { severity, title, message } = payload;
        navigate(
          `${path}?severity=${encodeURIComponent(severity)}&title=${encodeURIComponent(
            title
          )}&message=${encodeURIComponent(message)}`
        );
      } else {
        navigate(path);
      }
    },
    [onClose, navigate]
  );

  const handleAuth = useCallback(
    async (action, args) => {
      const resultAction = await dispatch(action(args));
      if (
        action === forgotPasswordThunk &&
        resultAction.meta.requestStatus === 'fulfilled'
      ) {
        handleCloseAndNavigate(`/notification`, resultAction.payload);
        return;
      }

      if (resultAction.meta.requestStatus === 'fulfilled') {
        handleCloseAndNavigate('/');
      }
    },
    [dispatch, handleCloseAndNavigate]
  );

  const handleLoginSubmit = useCallback(
    (formData) => handleAuth(loginThunk, formData),
    [handleAuth]
  );

  const handleRegistrationSubmit = useCallback(
    (formData) => handleAuth(registrationThunk, formData),
    [handleAuth]
  );

  const handleForgotPasswordSubmit = useCallback(
    (formData) => handleAuth(forgotPasswordThunk, formData),
    [handleAuth]
  );

  const handleToggleAuthMode = useCallback((mode) => setAuthMode(mode), []);

  const handleSwitchToLogin = useCallback(() => {
    handleToggleAuthMode('login');
  }, [handleToggleAuthMode]);

  const handleToggleLoginOrRegister = useCallback(() => {
    const nextMode = authMode === 'login' ? 'register' : 'login';
    handleToggleAuthMode(nextMode);
  }, [authMode, handleToggleAuthMode]);

  const handleModalClose = useCallback(() => {
    handleCloseAndNavigate('/');
  }, [handleCloseAndNavigate]);

  const handleForgotPasswordClick = useCallback(() => {
    handleToggleAuthMode('forgotPassword');
  }, [handleToggleAuthMode]);

  const getAvatarBgColor = useCallback(() => {
    switch (authMode) {
      case 'login':
        return 'success.light';
      case 'register':
        return 'success.main';
      default:
        return 'warning.main';
    }
  }, [authMode]);

  const renderTitle = useMemo(
    () => (
      <Box alignItems='center' display='flex' flexDirection='column'>
        <Avatar sx={{ ...stylesAuthPageAvatar, bgcolor: getAvatarBgColor() }}>
          <LockOutlined />
        </Avatar>
        <Typography sx={stylesAuthPageTitle} variant='h6'>
          {TITLES[authMode]}
        </Typography>
      </Box>
    ),
    [authMode, getAvatarBgColor]
  );

  const getContentByAuthMode = useCallback(() => {
    if (authMode === 'login') {
      return (
        <>
          <LoginForm isLoading={isLoading} onSubmit={handleLoginSubmit} />
          <Button
            fullWidth
            color='secondary'
            sx={{ mt: 2 }}
            variant='text'
            onClick={handleForgotPasswordClick}
          >
            Забули пароль?
          </Button>
        </>
      );
    }

    if (authMode === 'register') {
      return (
        <RegistrationForm
          isLoading={isLoading}
          onSubmit={handleRegistrationSubmit}
        />
      );
    }

    if (authMode === 'forgotPassword') {
      return (
        <ForgotPasswordForm
          isLoading={isLoading}
          onSubmit={handleForgotPasswordSubmit}
        />
      );
    }

    return null;
  }, [
    authMode,
    handleForgotPasswordClick,
    handleForgotPasswordSubmit,
    handleLoginSubmit,
    handleRegistrationSubmit,
    isLoading,
  ]);

  const renderContent = useMemo(
    () => getContentByAuthMode(),
    [getContentByAuthMode]
  );

  const renderActionButton = useMemo(() => {
    let buttonText = null;
    if (authMode === 'login') {
      buttonText = 'Перейти до реєстрації';
    } else if (authMode === 'register') {
      buttonText = 'Перейти до авторизації';
    } else {
      buttonText = 'Повернутися до авторизації';
    }
    const buttonHandler =
      authMode === 'forgotPassword'
        ? handleSwitchToLogin
        : handleToggleLoginOrRegister;
    return (
      <Button
        fullWidth
        color='secondary'
        variant='text'
        onClick={buttonHandler}
      >
        {buttonText}
      </Button>
    );
  }, [authMode, handleSwitchToLogin, handleToggleLoginOrRegister]);

  return (
    <ModalWindow
      actions={renderActionButton}
      content={renderContent}
      error={errorMessage}
      isOpen={isOpen}
      title={renderTitle}
      onClose={handleModalClose}
    />
  );
}

export default AuthPage;
