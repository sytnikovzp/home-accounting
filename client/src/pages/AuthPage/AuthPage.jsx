import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Fade, Box, Typography, Button } from '@mui/material';
// ==============================================================
import { stylesFadeBox } from '../../services/styleService';
// ==============================================================
import api from '../../api';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';

function AuthPage({ isOpen, onClose, checkAuthentication }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleAuth = async (endpoint, payload) => {
    try {
      setErrorMessage('');
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('accessToken', data.accessToken);
      checkAuthentication();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Помилка аутентифікації:', error.message);
      setErrorMessage('Помилка! Перевірте облікові дані.');
    }
  };

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
          {isLoginMode ? (
            <LoginForm
              onSubmit={({ email, password }) =>
                handleAuth('/auth/login', { email, password })
              }
            />
          ) : (
            <RegistrationForm
              onSubmit={({ fullName, email, password }) =>
                handleAuth('/auth/registration', { fullName, email, password })
              }
            />
          )}
          {errorMessage && (
            <Typography color='error' align='center' sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
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
