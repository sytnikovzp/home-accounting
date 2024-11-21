import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Fade, Box, Typography, Button } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import {
  stylesFadeBox,
  stylesFormBox,
  stylesErrorMessage,
} from '../../styles/theme';
// ==============================================================
import LoginForm from '../../components/LoginForm/LoginForm';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';

function AuthPage({ isOpen, onClose, checkAuthentication }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleAuth = useCallback(
    async (action, ...args) => {
      try {
        setErrorMessage('');
        if (action === 'login') {
          await restController.login(...args);
        } else {
          await restController.registration(...args);
        }
        checkAuthentication();
        onClose();
        navigate('/');
      } catch (error) {
        console.error(
          `${action === 'login' ? 'Авторизація' : 'Реєстрація'} неуспішна:`,
          error.message
        );
        setErrorMessage(
          action === 'login'
            ? 'Авторизація неуспішна. Перевірте облікові дані.'
            : 'Реєстрація неуспішна. Спробуйте знову.'
        );
      }
    },
    [checkAuthentication, navigate, onClose]
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      closeAfterTransition
      aria-labelledby='auth-modal-title'
      aria-describedby='auth-modal-description'
      onClose={() => {
        onClose();
        navigate('/');
      }}
    >
      <Fade in={isOpen}>
        <Box sx={stylesFadeBox}>
          <Box sx={stylesFormBox}>
            {isLoginMode ? (
              <LoginForm
                onSubmit={({ email, password }) =>
                  handleAuth('login', email, password)
                }
              />
            ) : (
              <RegistrationForm
                onSubmit={({ fullName, email, password }) =>
                  handleAuth('registration', fullName, email, password)
                }
              />
            )}
          </Box>
          {errorMessage && (
            <Box sx={stylesErrorMessage}>
              <Typography color='error'>{errorMessage}</Typography>
            </Box>
          )}
          <Button
            onClick={() => {
              setErrorMessage('');
              setIsLoginMode((prev) => !prev);
            }}
            variant='text'
            color='secondary'
            fullWidth
            sx={{ mt: 2 }}
          >
            {isLoginMode ? 'Перейти до реєстрації' : 'Перейти до авторизації'}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}

export default AuthPage;
