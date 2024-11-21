import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Fade, Box, Typography, Button } from '@mui/material';
// ==============================================================
import { stylesFadeBox } from '../../services/styleService';
// ==============================================================
import { auth } from '../../api/rest';
// ==============================================================
import LoginForm from '../../components/LoginForm/LoginForm';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';

function AuthPage({ isOpen, onClose, checkAuthentication }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      setErrorMessage('');
      await auth.login(email, password);
      checkAuthentication();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Авторизація неуспішна:', error.message);
      setErrorMessage('Авторизація неуспішна. Перевірте облікові дані.');
    }
  };

  const handleRegistration = async (fullName, email, password) => {
    try {
      setErrorMessage('');
      await auth.registration(fullName, email, password);
      checkAuthentication();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Реєстрація неуспішна:', error.message);
      setErrorMessage('Реєстрація неуспішна. Спробуйте знову.');
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
                handleLogin(email, password)}
            />
          ) : (
            <RegistrationForm
              onSubmit={({ fullName, email, password }) =>
                handleRegistration(fullName, email, password)
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
