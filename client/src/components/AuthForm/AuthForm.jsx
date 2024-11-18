import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ==============================================================
import api from '../../api';
import {
  Avatar,
  Box,
  TextField,
  Typography,
  Button,
  Grid2,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AuthForm = ({ setIsAuthenticated }) => {
  const handleSubmit = () => console.log('login');

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const loginHandle = async (email, password) => {
    try {
      setErrorMessage('');
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.log('Авторизація неуспішна: ', error.message);
      setErrorMessage('Авторизація неуспішна. Перевірте свої облікові данні.');
    }
  };

  const registrationHandle = async (fullName, email, password) => {
    try {
      setErrorMessage('');
      const { data } = await api.post('/auth/registration', {
        fullName,
        email,
        password,
      });
      localStorage.setItem('accessToken', data.accessToken);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.log('Реєстрація неуспішна: ', error.message);
      setErrorMessage('Реєстрація неуспішна. Спробуйте знову.');
    }
  };

  return (
    <>
      {errorMessage && <div className='error'>{errorMessage}</div>}

      {isLoginMode ? (
        <>
          <Avatar
            sx={{
              mx: 'auto',
              bgcolor: 'success.light',
              textAlign: 'center',
              width: 50,
              height: 50,
              mb: 2,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component='h1'
            variant='h5'
            sx={{ textAlign: 'center', fontWeight: 600 }}
          >
            Авторизація
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <TextField
              placeholder='example@gmail.com'
              label='E-mail'
              fullWidth
              required
              autoFocus
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder='Qwerty12'
              label='Password'
              fullWidth
              required
              type='password'
              sx={{ mb: 2 }}
            />
            <Button
              type='submit'
              variant='contained'
              color='success'
              size='large'
              fullWidth
              sx={{ mt: 2, mb: 2 }}
              onClick={loginHandle}
            >
              Увійти
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Avatar
            sx={{
              mx: 'auto',
              bgcolor: 'success.light',
              textAlign: 'center',
              width: 50,
              height: 50,
              mb: 2,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component='h1'
            variant='h5'
            sx={{ textAlign: 'center', fontWeight: 600 }}
          >
            Реєстрація
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <TextField
              placeholder='John Doe'
              label='Імʼя користувача'
              fullWidth
              required
              autoFocus
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder='example@gmail.com'
              label='E-mail'
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder='Qwerty12'
              label='Password'
              fullWidth
              required
              type='password'
              sx={{ mb: 2 }}
            />
            <Button
              type='submit'
              variant='contained'
              color='success'
              size='large'
              fullWidth
              sx={{ mt: 2, mb: 2 }}
              onClick={registrationHandle}
            >
              Зареєструватися та увійти
            </Button>
          </Box>
        </>
      )}

      <Grid2 container justifyContent='center' sx={{ m: 1 }}>
        <Grid2>
          <Button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMessage('');
            }}
          >
            Перейти до
            {isLoginMode
              ? ' реєстрації користувача'
              : ' авторизації користувача'}
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
};

export default AuthForm;
