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

function AuthPage() {
  const [authMode, setAuthMode] = useState('login');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSubmitting = useSelector(selectAuthIsLoading);
  const error = useSelector(selectAuthError);

  usePageTitle(location, AUTH_TITLES, authMode);

  const handleCloseAndNavigate = useCallback(
    (path, payload = null) => {
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
    [navigate]
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
          {AUTH_TITLES[authMode]}
        </Typography>
      </Box>
    ),
    [authMode, getAvatarBgColor]
  );

  const getContentByAuthMode = useCallback(() => {
    if (authMode === 'login') {
      return (
        <>
          <LoginForm isSubmitting={isSubmitting} onSubmit={handleLoginSubmit} />
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
          isSubmitting={isSubmitting}
          onSubmit={handleRegistrationSubmit}
        />
      );
    }

    if (authMode === 'forgotPassword') {
      return (
        <ForgotPasswordForm
          isSubmitting={isSubmitting}
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
    isSubmitting,
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
      isOpen
      actions={renderActionButton}
      content={renderContent}
      error={error}
      title={renderTitle}
      onClose={handleModalClose}
    />
  );
}

export default AuthPage;
