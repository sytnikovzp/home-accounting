import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
// ==============================================================
import { Box, TextField, Avatar, Button, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// ==============================================================
import api from '../../api';
// ==============================================================
import { AUTH_FORM_INITIAL } from '../../constants';
// ==============================================================
import {
  LOGIN_VALIDATION_SCHEME,
  REGISTRATION_VALIDATION_SCHEME,
} from '../../utils/validationSchemes';

function AuthForm({ onClose, checkAuthentication }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const validationSchema = isLoginMode
    ? LOGIN_VALIDATION_SCHEME
    : REGISTRATION_VALIDATION_SCHEME;

  const onFormSubmit = async (values) => {
    setErrorMessage('');
    const { email, password, fullName } = values;
    const endpoint = isLoginMode ? '/auth/login' : '/auth/registration';
    const payload = isLoginMode
      ? { email, password }
      : { fullName, email, password };
    try {
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('accessToken', data.accessToken);
      checkAuthentication();
      onClose();
      navigate('/');
    } catch (error) {
      console.error(
        `${isLoginMode ? 'Авторизація' : 'Реєстрація'} неуспішна: `,
        error.message
      );
      setErrorMessage(
        isLoginMode
          ? 'Авторизація неуспішна. Перевірте облікові дані.'
          : 'Реєстрація неуспішна. Спробуйте знову.'
      );
    }
  };

  const renderForm = ({ resetForm, errors, touched }) => {
    return (
      <Form id='auth-form'>
        <Box noValidate sx={{ mt: 3 }}>
          {!isLoginMode && (
            <Field
              name='fullName'
              as={TextField}
              label='Повне імʼя'
              placeholder='Іван Іванов'
              fullWidth
              required
              autoFocus={!isLoginMode}
              sx={{ mb: 2 }}
              error={touched.fullName && Boolean(errors.fullName)}
              helperText={touched.fullName && errors.fullName}
            />
          )}
          <Field
            name='email'
            as={TextField}
            label='E-mail'
            placeholder='example@gmail.com'
            fullWidth
            required
            autoFocus={isLoginMode}
            sx={{ mb: 2 }}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <Field
            name='password'
            as={TextField}
            label='Пароль'
            placeholder='Qwerty12'
            fullWidth
            required
            type='password'
            sx={{ mb: 2 }}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
        </Box>
        <Button
          type='submit'
          variant='contained'
          color='success'
          size='large'
          fullWidth
          sx={{ mt: 2, mb: 2 }}
        >
          {isLoginMode ? 'Увійти' : ' Зареєструватися та увійти'}
        </Button>
        {errorMessage && (
          <Typography color='error' align='center' sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          type='button'
          onClick={() => {
            setErrorMessage('');
            resetForm();
            setIsLoginMode(!isLoginMode);
          }}
          variant='text'
          color='secondary'
          fullWidth
          sx={{ mt: 2 }}
        >
          {isLoginMode ? 'Перейти до реєстрації' : 'Перейти до авторизації'}
        </Button>
      </Form>
    );
  };

  return (
    <>
      <Avatar
        sx={{
          mx: 'auto',
          bgcolor: isLoginMode ? 'success.light' : 'success.main',
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
        {isLoginMode ? 'Авторизація' : 'Реєстрація'}
      </Typography>
      <Formik
        initialValues={AUTH_FORM_INITIAL}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}
        validateOnMount={true}
        enableReinitialize
      >
        {renderForm}
      </Formik>
    </>
  );
}

export default AuthForm;
